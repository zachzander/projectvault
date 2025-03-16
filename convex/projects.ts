import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createFile = mutation({
 
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    // Add console.log for debugging
    console.log("Creating file with orgId:", process.env.SHARED_ORGANIZATION_ID);
    
    await ctx.db.insert("files", {
      title: args.name,
      orgId: process.env.SHARED_ORGANIZATION_ID!,
      url: "",
      storageId: "",
      type: "",
      size: 0,
      domains: [],
      userId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const getFiles = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return [];
    }

    try {
      // Add console.log for debugging
      console.log("Fetching files with orgId:", process.env.SHARED_ORGANIZATION_ID);
      
      const files = await ctx.db
        .query("files")
        .withIndex("by_org", (q) => 
          q.eq("orgId", process.env.SHARED_ORGANIZATION_ID!)
        )
        .collect();
      
      console.log("Found files:", files);
      return files;
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  },
});