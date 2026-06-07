import { UserRole } from "./roles";

export const SESSION_COOKIE = "apc_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const DEV_SESSION_SECRET = "apc-dev-session-secret-change-me";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

type AuthUser = CurrentUser & {
  password: string;
};

const AUTH_USERS: AuthUser[] = [
  {
    id: "apc-owner",
    name: "Darrell Armstrong",
    email: "owner@apc.local",
    role: "super_admin",
    password: "apc_owner_2026",
  },
  {
    id: "apc-dispatch-1",
    name: "APC Dispatcher",
    email: "dispatcher@apc.local",
    role: "dispatcher",
    password: "dispatch_2026",
  },
];

function toCurrentUser(user: AuthUser): CurrentUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const currentUser: CurrentUser = toCurrentUser(AUTH_USERS[0]);

function getSessionSecret() {
  const configuredSecret = process.env.APC_SESSION_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  return process.env.NODE_ENV === "production" ? null : DEV_SESSION_SECRET;
}

function bytesToBase64Url(bytes: Uint8Array) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
  const decoded = atob(padded);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

async function signSessionPayload(payload: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("APC_SESSION_SECRET is required in production.");
  }

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(payload)
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifySessionPayload(payload: string, signature: string) {
  try {
    const expectedSignature = await signSessionPayload(payload);
    return expectedSignature === signature;
  } catch {
    return false;
  }
}

export function validateCredentials(email: string, password: string): CurrentUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const found = AUTH_USERS.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );

  return found ? toCurrentUser(found) : null;
}

export async function getUserFromSessionValue(
  sessionValue?: string | null
): Promise<CurrentUser | null> {
  if (!sessionValue) {
    return null;
  }

  const [payload, signature] = sessionValue.split(".");
  if (!payload || !signature) {
    return null;
  }

  const isValid = await verifySessionPayload(payload, signature);
  if (!isValid) {
    return null;
  }

  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      id?: string;
      exp?: number;
    };

    if (!parsed.id || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }

    const found = AUTH_USERS.find((user) => user.id === parsed.id);
    return found ? toCurrentUser(found) : null;
  } catch {
    return null;
  }
}

export async function createSessionValue(user: CurrentUser): Promise<string> {
  const payload = bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        id: user.id,
        exp: Date.now() + SESSION_TTL_MS,
      })
    )
  );

  const signature = await signSessionPayload(payload);
  return `${payload}.${signature}`;
}

export function getDemoCredentials() {
  return AUTH_USERS.map((user) => ({
    email: user.email,
    password: user.password,
    role: user.role,
  }));
}
