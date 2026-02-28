import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export default function LegalPage({
  type,
}: {
  type: "privacy" | "terms" | "cookies" | "contact";
}) {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t(`legal.${type}.title`)} | AllTools</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t(`legal.${type}.title`)}
      </h1>
      <div className="prose prose-emerald max-w-none text-gray-600 whitespace-pre-wrap">
        {t(`legal.${type}.text`)}
      </div>
    </div>
  );
}
