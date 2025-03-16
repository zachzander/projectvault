import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("⚡ Webhook received"); // Debug log 1

    try {
      const body = await request.json();
      console.log("📦 Webhook body:", body); // Debug log 2

      const tokenIdentifier = body.data.id;
      const email = body.data.email_addresses[0].email_address;
      const name = `${body.data.first_name ?? ""} ${body.data.last_name ?? ""}`;
      const image = body.data.image_url;

      console.log("🧑 User data:", { // Debug log 3
        tokenIdentifier,
        email,
        name,
        image,
        orgId: process.env.SHARED_ORGANIZATION_ID
      });

      await ctx.runMutation(internal.users.createUser, {
        tokenIdentifier,
        name,
        image,
        email,
        orgIds: [{ 
          orgId: process.env.SHARED_ORGANIZATION_ID!,
          role: "member"
        }]
      });

      console.log("✅ User created successfully"); // Debug log 4
      return new Response(null, { status: 200 });
    } catch (err) {
      console.error("Webhook error:", err);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

export default http;
