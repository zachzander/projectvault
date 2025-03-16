import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to get a URL for uploading a file
export const generateUploadUrl = mutation({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("you must be logged in to upload files");
    }
    // Generate a storage upload URL that's valid for 2 minutes
    return await ctx.storage.generateUploadUrl();
  },
});

// Function to create a file record in the database
export const createFile = mutation({
  args: {
    title: v.string(),
    domains: v.array(v.string()),
    storageId: v.string(),
    type: v.string(),
    size: v.number(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new ConvexError("Failed to get storage URL");
    }

    // Create the file record in the database
    return await ctx.db.insert("files", {
     
      title: args.title,
      domains: args.domains,
      storageId: args.storageId,
      type: args.type,
      size: args.size,
      url: url,
      orgId: process.env.SHARED_ORGANIZATION_ID!,
      userId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

// Function to get all files
export const getFiles = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("files")
      .withIndex("by_org", (q) => 
        q.eq("orgId", process.env.SHARED_ORGANIZATION_ID!)
      )
      
      .collect();
  },
});
