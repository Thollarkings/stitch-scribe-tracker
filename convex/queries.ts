import { query } from "./_generated/server";
import { v } from "convex/values";

// List measurements for the current user, optional name search
export const listMeasurements = query({
  args: { searchTerm: v.optional(v.string()), userId: v.optional(v.string()) },
  handler: async (ctx, { searchTerm, userId }) => {
    // NOTE: For bootstrap, accept userId from client. Later, enforce auth via identity.
    if (!userId) return [];

    const store = ctx.db
      .query("measurements")
      .withIndex("by_userId", (q) => q.eq("userId", userId));

    const all = await store.collect();

    if (!searchTerm) return all;

    const term = searchTerm.toLowerCase();
    return all.filter((m) => m.name?.toLowerCase().includes(term));
  },
});
