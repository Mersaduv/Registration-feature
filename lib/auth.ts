import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  // In a production app, you would store sessions in a database
  // For simplicity, we'll use a cookie with the user ID
  // In a real app, use a session table or Redis
  
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  // In a production app, verify the token from database/Redis
  // For simplicity, we'll decode the user ID from the token
  // In a real app, you should use JWT or a session store
  try {
    // Simple implementation: token format is "userId:random"
    const parts = sessionToken.split(":");
    if (parts.length !== 2) {
      return null;
    }

    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(userId: number) {
  const token = `${userId}:${crypto.randomBytes(16).toString("hex")}`;
  
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  } catch (error) {
    // If cookies() fails (e.g., in Route Handler), return token to be set manually
    console.warn("Could not set cookie directly, token:", token);
  }

  return token;
}

export function createSessionCookieHeader(userId: number): string {
  const token = `${userId}:${crypto.randomBytes(16).toString("hex")}`;
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(user.password, password);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
