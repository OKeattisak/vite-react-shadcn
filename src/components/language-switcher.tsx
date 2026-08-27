import { LanguagesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage?.split("-")[0] === "en" ? "en" : "th";

  const nextLanguage = currentLanguage === "th" ? "en" : "th";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void i18n.changeLanguage(nextLanguage)}
    >
      <LanguagesIcon />
      {currentLanguage.toUpperCase()}
    </Button>
  );
}
