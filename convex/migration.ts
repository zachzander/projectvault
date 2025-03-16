import { mutation } from "./_generated/server";

export const migrateFiles = mutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db.query("files").collect();
    for (const file of files) {
      if (!file.orgId) {
        await ctx.db.patch(file._id, {
          orgId: process.env.SHARED_ORGANIZATION_ID!
        });
      }
    }
  }
});
