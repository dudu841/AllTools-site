import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { categories, toolPaths, type ToolId } from "../config/tools";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { lang = "pt" } = useParams<{ lang: string }>();
  const currentLang = ["pt", "en", "es"].includes(lang) ? (lang as "pt" | "en" | "es") : "pt";

  return (
    <>
      <SEO title={t("home.seoTitle")} description={t("home.seoDesc")} />

      <div className="space-y-6 text-center sm:space-y-8">
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">{t("home.marketing.eyebrow")}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t("home.title")}</h1>
          <p className="mx-auto mt-3 max-w-4xl text-base leading-relaxed text-gray-700 sm:text-lg">{t("home.subtitle")}</p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.aboutTitle")}</h2>
          <p className="mx-auto mt-3 max-w-4xl text-gray-700 leading-relaxed">{t("home.marketing.aboutText")}</p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.benefitsTitle")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 text-left sm:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article key={item} className="rounded-xl border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-900">{t(`home.marketing.benefit${item}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{t(`home.marketing.benefit${item}Text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.marketing.howTitle")}</h2>
          <ol className="mx-auto mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-left text-gray-700">
            {[1, 2, 3, 4, 5].map((step) => (
              <li key={step}>{t(`home.marketing.how${step}`)}</li>
            ))}
          </ol>
        </section>

        <section className="grid grid-cols-1 gap-4 text-left sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
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
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
