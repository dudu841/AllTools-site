import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { categories, toolPaths, type ToolId } from "../config/tools";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { lang = "pt" } = useParams<{ lang: string }>();
  const currentLang = ["pt", "en", "es"].includes(lang) ? (lang as "pt" | "en" | "es") : "pt";
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((category) => ({
        ...category,
        tools: category.tools.filter((toolId) => {
          const id = toolId as ToolId;
          const title = t(`tools.${id}.title`).toLowerCase();
          const desc = t(`tools.${id}.desc`).toLowerCase();
          return title.includes(query) || desc.includes(query);
        }),
      }))
      .filter((category) => category.tools.length > 0);
  }, [search, t]);

  return (
    <>
      <SEO title={t("home.seoTitle")} description={t("home.seoDesc")} />

      <div className="space-y-6 text-center sm:space-y-8">
        <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">{t("home.marketing.eyebrow")}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t("home.title")}</h1>
          <p className="mx-auto mt-3 max-w-4xl text-base leading-relaxed text-gray-700 sm:text-lg">{t("home.subtitle")}</p>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.aboutTitle")}</h2>
          <p className="mx-auto mt-3 max-w-4xl text-gray-700 leading-relaxed">{t("home.marketing.aboutText")}</p>
        </section>

        <section className="mx-auto w-full max-w-6xl">
          <div className="mb-5 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("home.searchPlaceholder", { defaultValue: "Qual ferramenta precisa?" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none ring-emerald-300 focus:ring-2 sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <article key={category.id} className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">{t(`home.categories.${category.id}`)}</h2>

                <ul className="space-y-3 text-left">
                  {category.tools.map((toolId) => {
                    const id = toolId as ToolId;
                    return (
                      <li key={id}>
                        <Link
                          to={`/${currentLang}/${toolPaths[id][currentLang]}`}
                          className="block rounded-2xl border border-gray-100 px-3 py-2 text-center transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          <p className="text-sm font-semibold text-emerald-700 sm:text-base">{t(`tools.${id}.title`)}</p>
                          <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t(`tools.${id}.desc`)}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.benefitsTitle")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 text-left sm:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article key={item} className="rounded-2xl border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-900">{t(`home.marketing.benefit${item}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{t(`home.marketing.benefit${item}Text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.howTitle")}</h2>
          <ol className="mx-auto mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-left text-gray-700">
            {[1, 2, 3, 4, 5].map((step) => (
              <li key={step}>{t(`home.marketing.how${step}`)}</li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
