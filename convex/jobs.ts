import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// TODO(auth): When switching to Convex Auth, use ctx.auth.getUserIdentity() and enforce subject === userId

export const listByMeasurement = query({
  args: { measurementId: v.id("measurements"), userId: v.string() },
  handler: async (ctx, { measurementId, userId }) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_measurement", q => q.eq("measurementId", measurementId))
      .collect();
    // Filter by user as a minimal guard while we use external auth
    return jobs.filter(j => j.userId === userId);
  }
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
  }
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    measurementId: v.id("measurements"),
    jobId: v.optional(v.id("jobs")),
    description: v.optional(v.string()),
    serviceCharge: v.number(),
    paidAmount: v.number(),
    currency: v.optional(v.string()),
    label: v.optional(v.string()),
    collectionDate: v.optional(v.string()),
    collectionDateType: v.optional(v.union(v.literal("estimated"), v.literal("exact"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const balance = args.serviceCharge - args.paidAmount;

    if (args.jobId) {
      await ctx.db.patch(args.jobId, {
        description: args.description,
        serviceCharge: args.serviceCharge,
        paidAmount: args.paidAmount,
        balance,
        currency: args.currency,
        label: args.label,
        collectionDate: args.collectionDate,
        collectionDateType: args.collectionDateType,
        updatedAt: now,
      });
      return args.jobId;
    }

    const id = await ctx.db.insert("jobs", {
      measurementId: args.measurementId,
      userId: args.userId,
      description: args.description,
      serviceCharge: args.serviceCharge,
      paidAmount: args.paidAmount,
      balance,
      currency: args.currency ?? "NGN",
      label: args.label,
      collectionDate: args.collectionDate,
      collectionDateType: args.collectionDateType,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  }
});

export const remove = mutation({
  args: { jobId: v.id("jobs"), userId: v.string() },
  handler: async (ctx, { jobId }) => {
    await ctx.db.delete(jobId);
    return true;
  }
});
