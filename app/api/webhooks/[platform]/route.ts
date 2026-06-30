import { NextResponse } from "next/server";
import { methodNotAllowed, withCors } from "@/lib/security/apiHelpers";
import {
  getWebhookSecurityMode,
  handlePlatformWebhook,
  isSupportedPlatformWebhook,
  type IncomingPlatformWebhook,
  validateWebhookSignature,
  validateWebhookSecret,
} from "@/lib/integrations/webhooks";

type RouteContext = {
  params: Promise<{
    platform: string;
  }>;
};

export async function GET() {
  return methodNotAllowed(["POST", "OPTIONS"]);
}

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: Request, context: RouteContext) {
  const origin = request.headers.get("origin");
  const { platform } = await context.params;

  if (!isSupportedPlatformWebhook(platform)) {
    return withCors(
      NextResponse.json({ success: false, message: "Unsupported platform." }, { status: 404 }),
      origin
    );
  }

  const rawBody = await request.text();
  const timestampHeader = request.headers.get("x-apc-timestamp");
  const signatureHeader = request.headers.get("x-apc-signature");

  const signatureValidation = validateWebhookSignature(platform, timestampHeader, signatureHeader, rawBody);
  const legacyModeEnabled = getWebhookSecurityMode() === "compat-secret-header";

  if (!signatureValidation.valid && !legacyModeEnabled) {
    return withCors(
      NextResponse.json({ success: false, message: signatureValidation.reason }, { status: 401 }),
      origin
    );
  }

  if (!signatureValidation.valid && legacyModeEnabled) {
    const webhookSecret = request.headers.get("x-apc-webhook-secret");
    if (!validateWebhookSecret(platform, webhookSecret)) {
      return withCors(
        NextResponse.json({ success: false, message: "Invalid webhook authentication." }, { status: 401 }),
        origin
      );
    }
  }

  const body = (() => {
    try {
      return JSON.parse(rawBody || "null") as IncomingPlatformWebhook | null;
    } catch {
      return null;
    }
  })();
  if (!body) {
    return withCors(
      NextResponse.json({ success: false, message: "Invalid JSON payload." }, { status: 400 }),
      origin
    );
  }

  handlePlatformWebhook(platform, body);

  return withCors(
    NextResponse.json({ success: true, accepted: true, platform, auth: signatureValidation.valid ? "signature" : "legacy" }),
    origin
  );
}
