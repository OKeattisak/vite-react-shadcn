import { useTranslation } from "react-i18next";

export function DashboardPage() {
  const { t } = useTranslation();

  return <div>{t("dashboard.greeting")}</div>;
}
