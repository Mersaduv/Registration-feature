import { POST } from "@/app/api/register/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/password", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("@/lib/rate-limit", () => ({
  rateLimiter: {
    limit: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe("POST /api/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (hashPassword as jest.Mock).mockResolvedValue("hashed_password");

    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Registration successful");
    expect(data.userId).toBe(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "john@example.com" },
      select: { id: true },
    });
    expect(hashPassword).toHaveBeenCalledWith("Password123");
  });

  it("should return 422 for invalid input", async () => {
    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "invalid-email",
        password: "123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.errors).toBeDefined();
  });

  it("should return 409 for duplicate email", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "existing@example.com",
        password: "Password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe("Email already registered");
  });
});
