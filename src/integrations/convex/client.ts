import { ConvexReactClient } from "convex/react";

// Create the client with the public URL from env
export const convexClient = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string
);
