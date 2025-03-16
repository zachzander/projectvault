import { clerkMiddleware } from "@clerk/nextjs/server";

// Export Clerk middleware
export default clerkMiddleware();


export const config = {
  matcher: [  "/((?!.+\\.[\\w]+$|_next|favicon.ico).* )", "/", "/(api|trpc)(.*)" ],
};
