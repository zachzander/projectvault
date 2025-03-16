import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      if (result.type === "user.created") {
        console.log("User created webhook received", {
          userId: result.data.id,
          orgId: process.env.SHARED_ORGANIZATION_ID
        });
        
        await ctx.runMutation(internal.users.createUser, {
          tokenIdentifier: result.data.id,
          name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
          image: result.data.image_url,
          email: result.data.email_addresses[0]?.email_address ?? "",
          orgIds: [{ 
            orgId: process.env.SHARED_ORGANIZATION_ID!, 
            role: "member" 
          }]
        });
      }

      return new Response(null, { status: 200 });
    } catch (err) {
      console.error("Error in webhook:", err);
      return new Response("Webhook Error", { status: 400 });
    }
  }),
});

export default http;