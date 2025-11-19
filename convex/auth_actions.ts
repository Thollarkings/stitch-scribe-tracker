"use node";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { createHash, randomBytes } from "crypto";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function randomToken() {
  return randomBytes(24).toString("hex");
}

export const register = action({
  args: { email: v.string(), password: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, { email, password, name }) => {
    try {
      const lower = email.toLowerCase();
      const passwordHash = hashPassword(password);
      // Ensure no duplicate
      const existing = await ctx.runQuery(api.auth.findUserByEmail, { email: lower });
      if (existing) throw new Error("Email already registered");
      const { userId } = await ctx.runMutation(api.auth.registerInternal, { email: lower, name: name ?? "", passwordHash });
      const token = randomToken();
      await ctx.runMutation(api.auth.createSession, { userId, token });
      return { token, user: { id: userId, email: lower, name: name ?? "" } };
    } catch (e: any) {
      throw new Error(e?.message || "Registration failed. Please try again.");
    }
  }
});

export const login = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    try {
      const lower = email.toLowerCase();
      const user = await ctx.runQuery(api.auth.findUserByEmail, { email: lower });
      if (!user) throw new Error("Invalid email or password");
      if (!('passwordHash' in user) || typeof user.passwordHash !== 'string') {
        throw new Error("User account is not properly configured. Please register again.");
      }
      const passwordHash = hashPassword(password);
      if (passwordHash !== user.passwordHash) throw new Error("Invalid email or password");

      const token = randomToken();
      await ctx.runMutation(api.auth.createSession, { userId: user._id, token });
      return { token, user: { id: user._id, email: user.email, name: user.name } };
    } catch (e: any) {
      throw new Error(e?.message || "Login failed. Please try again.");
    }
  }
});

export const logout = action({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await ctx.runMutation(api.auth.removeSessionByToken, { token });
    return true;
  }
});
