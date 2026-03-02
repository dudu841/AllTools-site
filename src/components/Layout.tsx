import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    if (lang && ["en", "pt", "es"].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 text-gray-900 font-sans">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
