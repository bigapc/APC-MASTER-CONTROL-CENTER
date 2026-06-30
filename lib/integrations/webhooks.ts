import { emitAuditEvent, emitNotification } from "@/lib/events/liveEventEmitter";

export type SupportedPlatformWebhook = "safeconnect" | "communitysafeconnect" | "csc_2_0";

type WebhookConfig = {
  name: string;
  secretEnv: string;
};

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

export function validateWebhookSecret(platform: SupportedPlatformWebhook, providedSecret: string | null) {
  const expected = getWebhookSecret(platform);
  return Boolean(expected) && Boolean(providedSecret) && expected === providedSecret;
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
