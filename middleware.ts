import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Match all routes except the root `/`
const isProtectedRoute = createRouteMatcher(["(/generatePage)", "(/images)"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    // Allow access to public routes without authentication
    return;
  }

  if (isProtectedRoute(req)) {
    // Protect the route if it matches the defined pattern
    auth().protect();
  }
});

export const config = {
  matcher: [
    // This matcher excludes Next.js internal routes, static files, and allows protection for all other paths
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
