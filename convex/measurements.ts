import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { searchTerm: v.optional(v.string()), userId: v.string() },
  handler: async (ctx, { searchTerm, userId }) => {
    const store = ctx.db
      .query("measurements")
      .withIndex("by_userId", (q) => q.eq("userId", userId));

    const all = await store.collect();
    if (!searchTerm) return all;
    const term = searchTerm.toLowerCase();
    return all.filter((m) => m.name?.toLowerCase().includes(term));
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    comments: v.optional(v.string()),
    collectionDate: v.optional(v.string()),
    collectionDateType: v.optional(v.union(v.literal("estimated"), v.literal("exact"))),

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
    const id = await ctx.db.insert("measurements", { ...args, createdAt: now, updatedAt: now });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("measurements"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    comments: v.optional(v.string()),
    collectionDate: v.optional(v.string()),
    collectionDateType: v.optional(v.union(v.literal("estimated"), v.literal("exact"))),

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
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("measurements") },
  handler: async (ctx, { id }) => {
    // delete child jobs
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_measurement", (q) => q.eq("measurementId", id))
      .collect();
    for (const job of jobs) await ctx.db.delete(job._id);
    await ctx.db.delete(id);
    return true;
  },
});

export const bulkImport = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.object({
      name: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      gender: v.optional(v.string()),
      comments: v.optional(v.string()),
      collectionDate: v.optional(v.string()),
      collectionDateType: v.optional(v.union(v.literal("estimated"), v.literal("exact"))),
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
    }))
  },
  handler: async (ctx, { userId, items }) => {
    const now = Date.now();
    for (const item of items) {
      await ctx.db.insert("measurements", { userId, ...item, createdAt: now, updatedAt: now });
    }
    return items.length;
  },
});
