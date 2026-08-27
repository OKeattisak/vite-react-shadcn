import { HouseIcon, RefreshCwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

import { Button, buttonVariants } from "@/components/ui/button";

export function RouteErrorPage() {
  const error = useRouteError();
  const { t } = useTranslation();

  const status = isRouteErrorResponse(error) ? error.status : 500;

  const description =
    import.meta.env.DEV && error instanceof Error
      ? error.message
      : t("errors.generic.description");

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="flex max-w-lg flex-col items-center gap-4 text-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{status}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {t("errors.generic.title")}
          </h1>

          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={() => window.location.reload()}>
            <RefreshCwIcon />
            {t("errors.retry")}
          </Button>

          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            <HouseIcon />
            {t("errors.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
