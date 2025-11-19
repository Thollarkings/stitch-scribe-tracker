import { mutation } from "convex/server";
import { v } from "convex/values";

export const createMeasurement = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    comments: v.optional(v.string()),
    collectionDate: v.optional(v.string()),
    collectionDateType: v.optional(v.union(v.literal("estimated"), v.literal("exact"))),

    // numeric fields (all optional)
    head: v.optional(v.number()),
    neck: v.optional(v.number()),
    shoulderToShoulder: v.optional(v.number()),
    chest: v.optional(v.number()),
    waist: v.optional(v.number()),
    shoulderToNipple: v.optional(v.number()),
    shoulderToUnderbust: v.optional(v.number()),
    shoulderToWaist: v.optional(v.number()),
    nippleToNipple: v.optional(v.number()),
    sleeveLength: v.optional(v.number()),
    roundSleeve: v.optional(v.number()),
    hip: v.optional(v.number()),
    halfLength: v.optional(v.number()),
    topLength: v.optional(v.number()),
    gownLength: v.optional(v.number()),
    trouserWaist: v.optional(v.number()),
    crotch: v.optional(v.number()),
    trouserLength: v.optional(v.number()),
    thigh: v.optional(v.number()),
    waistToKnee: v.optional(v.number()),
    calf: v.optional(v.number()),
    ankle: v.optional(v.number()),
    insideLegSeam: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const id = await ctx.db.insert("measurements", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const upsertJob = mutation({
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
  },
});
