import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ConvexProvider } from "convex/react";
import { convexClient } from "@/integrations/convex/client";

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convexClient}>
    <App />
  </ConvexProvider>
);




