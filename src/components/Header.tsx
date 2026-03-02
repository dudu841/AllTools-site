import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe } from "lucide-react";
import { toolPaths, type ToolId } from "../config/tools";

const supportedLangs = ["en", "pt", "es"] as const;

type SiteLang = (typeof supportedLangs)[number];

function translateToolSlug(currentSlug: string, targetLang: SiteLang): string {
  const toolId = (Object.keys(toolPaths) as ToolId[]).find((id) =>
    supportedLangs.some((lang) => toolPaths[id][lang] === currentSlug),
  );

  if (!toolId) {
    return currentSlug;
  }

  return toolPaths[toolId][targetLang];
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lng: SiteLang) => {
    const pathParts = location.pathname.split("/").filter(Boolean);

    if (pathParts.length === 0) {
      navigate(`/${lng}`);
      i18n.changeLanguage(lng);
      return;
    }

    const currentLang = pathParts[0];
    if (supportedLangs.includes(currentLang as SiteLang)) {
      pathParts[0] = lng;

      if (pathParts[1]) {
        pathParts[1] = translateToolSlug(pathParts[1], lng);
      }

      navigate(`/${pathParts.join("/")}`);
    } else {
      navigate(`/${lng}${location.pathname}`);
    }

    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const currentLang = (i18n.language.split("-")[0] || "en") as SiteLang;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link to={`/${currentLang}`} className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xl">
            T
          </div>
          <span className="truncate text-lg font-bold text-gray-900 sm:text-xl">Toolss</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600">
              <Globe className="h-4 w-4" />
              {currentLang.toUpperCase()}
            </button>
            <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden group-hover:block">
              <div className="py-1">
                <button onClick={() => changeLanguage("en")} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  English
                </button>
                <button onClick={() => changeLanguage("pt")} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Português
                </button>
                <button onClick={() => changeLanguage("es")} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Español
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Open language menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-3 py-3">
          <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <Globe className="h-3.5 w-3.5" />
            {t("common.language")}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => changeLanguage("en")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700">EN</button>
            <button onClick={() => changeLanguage("pt")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700">PT</button>
            <button onClick={() => changeLanguage("es")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700">ES</button>
          </div>
        </div>
      )}
    </header>
  );
}
