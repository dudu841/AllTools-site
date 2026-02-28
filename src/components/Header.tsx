import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe } from "lucide-react";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    if (pathParts.length > 0 && ["en", "pt", "es"].includes(pathParts[0])) {
      pathParts[0] = lng;
      navigate("/" + pathParts.join("/"));
    } else {
      navigate(`/${lng}${currentPath}`);
    }
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const currentLang = i18n.language.split("-")[0] || "en";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to={`/${currentLang}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold text-gray-900">AllTools</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600">
              <Globe className="h-4 w-4" />
              {currentLang.toUpperCase()}
            </button>
            <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("pt")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Português
                </button>
                <button
                  onClick={() => changeLanguage("es")}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Español
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <div className="px-3 py-2 text-sm font-medium text-gray-500">
              {t("common.language")}
            </div>
            <button
              onClick={() => changeLanguage("en")}
              className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("pt")}
              className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
            >
              Português
            </button>
            <button
              onClick={() => changeLanguage("es")}
              className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
            >
              Español
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
