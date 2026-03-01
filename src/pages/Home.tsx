import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { categories, toolPaths, type ToolId } from "../config/tools";
import { useTranslation } from "react-i18next";

const localeTitles: Record<string, string> = {
  pt: "Toolss – Ferramentas Online Grátis",
  en: "Toolss – Free Online Tools",
  es: "Toolss – Herramientas Online Gratis",
};

const localeDescriptions: Record<string, string> = {
  pt: "Use ferramentas diretamente no navegador. Sem instalar nada.",
  en: "Use tools directly in your browser. No installation required.",
  es: "Usa herramientas directamente en tu navegador. Sin instalación.",
};

export default function Home() {
  const { t } = useTranslation();
  const { lang = "pt" } = useParams<{ lang: string }>();
  const currentLang = ["pt", "en", "es"].includes(lang) ? (lang as "pt" | "en" | "es") : "pt";

  return (
    <>
      <SEO
        title={localeTitles[currentLang]}
        description={localeDescriptions[currentLang]}
      />

      <div className="space-y-6 sm:space-y-8">
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t("home.title")}</h1>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-gray-700 sm:text-lg">{t("home.subtitle")}</p>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <section key={category.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">{t(`home.categories.${category.id}`)}</h2>

              <ul className="space-y-3">
                {category.tools.map((toolId) => {
                  const id = toolId as ToolId;
                  return (
                    <li key={id}>
                      <Link
                        to={`/${currentLang}/${toolPaths[id][currentLang]}`}
                        className="block rounded-xl border border-gray-100 px-3 py-2 transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <p className="text-sm font-semibold text-emerald-700 sm:text-base">{t(`tools.${id}.title`)}</p>
                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t(`tools.${id}.desc`)}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
