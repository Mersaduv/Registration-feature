import { registerSchema } from "@/lib/validation";

describe("registerSchema", () => {
  it("should validate correct input", () => {
    const validInput = {
      name: "John Doe",
      email: "john@example.com",
      password: "password12345678",
    };

    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidInput = {
      name: "John Doe",
      email: "invalid-email",
      password: "password12345678",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("should reject short password", () => {
    const invalidInput = {
      name: "John Doe",
      email: "john@example.com",
      password: "short",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });

  it("should accept password with only lowercase letters if 8+ characters", () => {
    const validInput = {
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    };

    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
});
