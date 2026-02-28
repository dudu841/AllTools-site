import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, Image, DollarSign, Share2, Wrench } from "lucide-react";
import { categories, toolPaths } from "../config/tools";
import AdBanner from "../components/AdBanner";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  Image: <Image className="w-6 h-6" />,
  DollarSign: <DollarSign className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] || "en";

  return (
    <div className="flex flex-col items-center">
      <Helmet>
        <title>{t("home.title")} | AllTools</title>
        <meta name="description" content={t("home.subtitle")} />
        <link
          rel="alternate"
          hrefLang="en"
          href={`${window.location.origin}/en`}
        />
        <link
          rel="alternate"
          hrefLang="pt"
          href={`${window.location.origin}/pt`}
        />
        <link
          rel="alternate"
          hrefLang="es"
          href={`${window.location.origin}/es`}
        />
      </Helmet>

      <section className="w-full py-12 md:py-24 lg:py-32 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          {t("home.title")}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          {t("home.subtitle")}
        </p>
      </section>

      <AdBanner slotId="top-banner" className="mb-16" />

      <div className="w-full space-y-16">
        {categories.map((category) => (
          <section key={category.id} className="w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                {iconMap[category.icon]}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t(`home.categories.${category.id}`)}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((toolId) => {
                const path =
                  toolPaths[toolId as keyof typeof toolPaths][
                    currentLang as "en" | "pt" | "es"
                  ];
                return (
                  <Link
                    key={toolId}
                    to={`/${currentLang}/${path}`}
                    className="group flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 mb-2">
                      {t(`tools.${toolId}.title`)}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {t(`tools.${toolId}.desc`)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <AdBanner slotId="bottom-banner" className="mt-16" />
    </div>
  );
}
