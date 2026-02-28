import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] || "en";

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              to={`/${currentLang}`}
              className="flex items-center gap-2 mb-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold text-gray-900">AllTools</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              {t("home.subtitle")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/${currentLang}/privacy`}
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${currentLang}/terms`}
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${currentLang}/cookies`}
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/${currentLang}/contact`}
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AllTools. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
