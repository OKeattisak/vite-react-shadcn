import "@/lib/sentry";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "@/index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSync } from "@/components/theme-sync";
import "@/lib/i18n";
import { router } from "@/app/router";
import { queryClient } from "@/lib/query/query-client";

const appFonts = ["noto-sans-thai", "kanit", "sarabun"] as const;
type AppFont = (typeof appFonts)[number];
function isAppFont(value: unknown): value is AppFont {
  return typeof value === "string" && appFonts.includes(value as AppFont);
}
const requestedFont = import.meta.env.VITE_APP_FONT;
const appFont: AppFont = isAppFont(requestedFont)
  ? requestedFont
  : "noto-sans-thai";

document.documentElement.dataset.font = appFont;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeSync />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
