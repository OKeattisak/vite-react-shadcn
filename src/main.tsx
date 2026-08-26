import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "@/index.css";
import App from "@/App";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardPage } from "@/pages/dashboard-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
]);

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
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>,
);
