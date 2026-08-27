import { createBrowserRouter } from "react-router";

import App from "@/App";
import { RouteErrorPage } from "@/pages/route-error-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        index: true,
        lazy: {
          Component: async () =>
            (await import("@/pages/dashboard-page")).DashboardPage,
        },
      },
    ],
  },
  {
    path: "*",
    ErrorBoundary: RouteErrorPage,
    lazy: {
      Component: async () =>
        (await import("@/pages/not-found-page")).NotFoundPage,
    },
  },
]);
