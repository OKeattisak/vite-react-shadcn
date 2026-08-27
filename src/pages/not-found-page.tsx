import { HomeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { buttonVariants } from "@/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t("errors.notFound.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("errors.notFound.description")}
        </p>
      </div>

      <Link to="/" className={buttonVariants()}>
        <HomeIcon />
        {t("errors.backHome")}
      </Link>
    </section>
  );
}
