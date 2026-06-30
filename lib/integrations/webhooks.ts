import { emitAuditEvent, emitNotification } from "@/lib/events/liveEventEmitter";
import { createHmac, timingSafeEqual } from "node:crypto";

export type SupportedPlatformWebhook = "safeconnect" | "communitysafeconnect" | "csc_2_0";

type WebhookConfig = {
  name: string;
  secretEnv: string;
};

export type WebhookSecurityMode = "strict-signature" | "compat-secret-header";

export type IncomingPlatformWebhook = {
  eventType?: string;
  actor?: string;
  title?: string;
  message?: string;
  level?: "info" | "warning" | "critical";
  payload?: unknown;
};

const WEBHOOK_CONFIG: Record<SupportedPlatformWebhook, WebhookConfig> = {
  safeconnect: {
    name: "SafeConnect",
    secretEnv: "SAFECONNECT_WEBHOOK_SECRET",
  },
  communitysafeconnect: {
    name: "CommunitySafeConnect",
    secretEnv: "COMMUNITYSAFECONNECT_WEBHOOK_SECRET",
  },
  csc_2_0: {
    name: "CSC 2.0",
    secretEnv: "CSC_2_WEBHOOK_SECRET",
  },
};

export function isSupportedPlatformWebhook(value: string): value is SupportedPlatformWebhook {
  return value in WEBHOOK_CONFIG;
}

export function getWebhookSecret(platform: SupportedPlatformWebhook) {
  return process.env[WEBHOOK_CONFIG[platform].secretEnv]?.trim() ?? "";
}

export function getWebhookSecurityMode(): WebhookSecurityMode {
  return process.env.APC_ALLOW_LEGACY_WEBHOOK_SECRET_HEADER === "1"
    ? "compat-secret-header"
    : "strict-signature";
}

export function validateWebhookSecret(platform: SupportedPlatformWebhook, providedSecret: string | null) {
  const expected = getWebhookSecret(platform);
  return Boolean(expected) && Boolean(providedSecret) && expected === providedSecret;
}

function normalizeHexSignature(value: string | null) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  return trimmed.startsWith("sha256=") ? trimmed.slice(7) : trimmed;
}

function safeHexEqual(expectedHex: string, providedHex: string) {
  try {
    const expectedBuffer = Buffer.from(expectedHex, "hex");
    const providedBuffer = Buffer.from(providedHex, "hex");

    if (!expectedBuffer.length || expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}

export function validateWebhookSignature(
  platform: SupportedPlatformWebhook,
  timestampHeader: string | null,
  signatureHeader: string | null,
  rawBody: string
) {
  const expectedSecret = getWebhookSecret(platform);
  if (!expectedSecret) {
    return { valid: false, reason: "Webhook secret is not configured for platform." };
  }

  const timestampValue = Number.parseInt(timestampHeader?.trim() ?? "", 10);
  if (!Number.isFinite(timestampValue)) {
    return { valid: false, reason: "Missing or invalid timestamp." };
  }

  const now = Math.floor(Date.now() / 1000);
  const maxSkewSeconds = 300;
  if (Math.abs(now - timestampValue) > maxSkewSeconds) {
    return { valid: false, reason: "Webhook timestamp is outside the allowed window." };
  }

  const providedSignature = normalizeHexSignature(signatureHeader);
  if (!providedSignature) {
    return { valid: false, reason: "Missing signature header." };
  }

  const signedPayload = `${timestampValue}.${rawBody}`;
  const expectedSignature = createHmac("sha256", expectedSecret)
    .update(signedPayload)
    .digest("hex");

  if (!safeHexEqual(expectedSignature, providedSignature)) {
    return { valid: false, reason: "Signature mismatch." };
  }

  return { valid: true as const, reason: null };
}

export function handlePlatformWebhook(platform: SupportedPlatformWebhook, event: IncomingPlatformWebhook) {
  const platformName = WEBHOOK_CONFIG[platform].name;
  const eventType = event.eventType?.trim() || "webhook.received";
  const actor = event.actor?.trim() || platformName;

  emitAuditEvent(`${platform}:${eventType}`, actor, platform, event.payload ?? event);

  if (event.title || event.message) {
    emitNotification(
      event.title?.trim() || `${platformName} webhook event`,
      event.message?.trim() || `${platformName} sent ${eventType}`,
      event.level ?? "info",
      platform
    );
  }
}
