import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ToolWrapper from "./pages/ToolWrapper";
import LegalPage from "./pages/LegalPage";

function RootRedirect() {
  const { i18n } = useTranslation();
  const detectedLang = i18n.language.split("-")[0] || "en";
  const lang = ["en", "pt", "es"].includes(detectedLang) ? detectedLang : "en";
  return <Navigate to={`/${lang}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RootRedirect />} />
          <Route path=":lang" element={<Home />} />
          <Route path=":lang/privacy" element={<LegalPage type="privacy" />} />
          <Route path=":lang/terms" element={<LegalPage type="terms" />} />
          <Route path=":lang/cookies" element={<LegalPage type="cookies" />} />
          <Route path=":lang/contact" element={<LegalPage type="contact" />} />
          <Route path=":lang/:toolPath" element={<ToolWrapper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
