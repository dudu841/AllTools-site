import React, { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { toolPaths, ToolId } from "../config/tools";
import AdBanner from "../components/AdBanner";

// Tool Components
import CompoundInterest from "../tools/Finance/CompoundInterest";
import LoanSimulator from "../tools/Finance/LoanSimulator";
import PercentageCalculator from "../tools/Finance/PercentageCalculator";
import BioGenerator from "../tools/Social/BioGenerator";
import HashtagGenerator from "../tools/Social/HashtagGenerator";
import CharacterCounter from "../tools/Social/CharacterCounter";
import QrGenerator from "../tools/Utilities/QrGenerator";
import PasswordGenerator from "../tools/Utilities/PasswordGenerator";
import AgeCalculator from "../tools/Utilities/AgeCalculator";
import UnitConverter from "../tools/Utilities/UnitConverter";
import PlaceholderTool from "../tools/PlaceholderTool";

import CompressImage from "../tools/Image/CompressImage";
import ResizeImage from "../tools/Image/ResizeImage";
import ConvertImage from "../tools/Image/ConvertImage";
import RemoveBackground from "../tools/Image/RemoveBackground";
import AdjustImage from "../tools/Image/AdjustImage";
import MergePdf from "../tools/Pdf/MergePdf";
import SplitPdf from "../tools/Pdf/SplitPdf";

const placeholder = (toolId: ToolId): React.FC => () => <PlaceholderTool toolId={toolId} />;

const toolComponents: Record<ToolId, React.FC> = {
  "pdf-to-word": placeholder("pdf-to-word"),
  "word-to-pdf": placeholder("word-to-pdf"),
  "compress-pdf": placeholder("compress-pdf"),
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "compress-image": CompressImage,
  "resize-image": ResizeImage,
  "convert-image": ConvertImage,
  "remove-background": RemoveBackground,
  "adjust-image": AdjustImage,
  "compound-interest": CompoundInterest,
  "loan-simulator": LoanSimulator,
  "percentage-calculator": PercentageCalculator,
  "bio-generator": BioGenerator,
  "hashtag-generator": HashtagGenerator,
  "character-counter": CharacterCounter,
  "qr-generator": QrGenerator,
  "password-generator": PasswordGenerator,
  "age-calculator": AgeCalculator,
  "unit-converter": UnitConverter,
  "logo-remover": placeholder("logo-remover"),
  "image-upscaler-4k": placeholder("image-upscaler-4k"),
  "bmi-calculator": placeholder("bmi-calculator"),
  "calorie-calculator": placeholder("calorie-calculator"),
  "mortgage-calculator": placeholder("mortgage-calculator"),
  "net-gross-salary": placeholder("net-gross-salary"),
  "discount-margin-markup": placeholder("discount-margin-markup"),
  "travel-time-calculator": placeholder("travel-time-calculator"),
  "apr-monthly-converter": placeholder("apr-monthly-converter"),
  "stock-simulator": placeholder("stock-simulator"),
  "investment-simulator": placeholder("investment-simulator"),
  "word-counter": placeholder("word-counter"),
  "text-case-converter": placeholder("text-case-converter"),
  "password-strength-checker": placeholder("password-strength-checker"),
  "encrypt-decrypt": placeholder("encrypt-decrypt"),
  "base-converter": placeholder("base-converter"),
  "scientific-calculator": placeholder("scientific-calculator"),
  "currency-converter": placeholder("currency-converter"),
  "cm-inch-converter": placeholder("cm-inch-converter"),
  "kg-lbs-converter": placeholder("kg-lbs-converter"),
  "sqm-sqft-converter": placeholder("sqm-sqft-converter"),
  "backlink-counter": placeholder("backlink-counter"),
  "rank-checker": placeholder("rank-checker"),
  "meta-tags-checker": placeholder("meta-tags-checker"),
  "html-css-validator": placeholder("html-css-validator"),
};

function getPrimaryActionKey(toolId: ToolId): "common.convert" | "common.compress" | "common.calculate" | "common.generate" {
  if (["pdf-to-word", "word-to-pdf", "convert-image", "unit-converter"].includes(toolId)) {
    return "common.convert";
  }

  if (["compress-pdf", "compress-image"].includes(toolId)) {
    return "common.compress";
  }

  if (["compound-interest", "loan-simulator", "percentage-calculator", "age-calculator"].includes(toolId)) {
    return "common.calculate";
  }

  return "common.generate";
}

export default function ToolWrapper() {
  const { lang, toolPath } = useParams<{ lang: string; toolPath: string }>();
  const { t } = useTranslation();

  // Find the tool ID based on the path and language
  let currentToolId: ToolId | null = null;
  for (const [id, paths] of Object.entries(toolPaths)) {
    if (paths[lang as "en" | "pt" | "es"] === toolPath) {
      currentToolId = id as ToolId;
      break;
    }
  }

  if (!currentToolId) {
    return <Navigate to={`/${lang}`} replace />;
  }

  const ToolComponent = toolComponents[currentToolId];
  const primaryAction = t(getPrimaryActionKey(currentToolId));
  const [aiPrompt, setAiPrompt] = useState("");

  const aiSuggestions = useMemo(() => {
    const title = t(`tools.${currentToolId}.title`);
    return [
      t("common.guide.step1"),
      `${title}: ${t(`tools.${currentToolId}.desc`)}`,
      `${t("common.guide.step3", { action: primaryAction })}`,
    ];
  }, [currentToolId, primaryAction, t]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Helmet>
        <title>{t(`tools.${currentToolId}.title`)} | Toolss</title>
        <meta name="description" content={t(`tools.${currentToolId}.desc`)} />
      </Helmet>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t(`tools.${currentToolId}.title`)}
        </h1>
        <p className="text-lg text-gray-600">
          {t(`tools.${currentToolId}.desc`)}
        </p>
      </div>

      <AdBanner slotId="tool-top" className="mb-8" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <ToolComponent />
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("common.objectiveTitle")}</h2>
        <p className="mt-3 text-gray-700">{t(`tools.${currentToolId}.desc`)}</p>

        <h3 className="mt-6 text-xl font-semibold text-gray-900">{t("common.howToUseTitle")}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700">
          <li>{t("common.guide.step1")}</li>
          <li>{t("common.guide.step2")}</li>
          <li>{t("common.guide.step3", { action: primaryAction })}</li>
          <li>{t("common.guide.step4")}</li>
        </ol>
      </section>

      <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8">
        <h3 className="text-xl font-bold text-emerald-900">🤖 Auxílio de IA</h3>
        <p className="mt-2 text-emerald-800">
          Assistente interativo para orientar o uso da ferramenta e sugerir próximos passos automaticamente.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {aiSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setAiPrompt(suggestion)}
              className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-100"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-4">
          <p className="text-sm font-semibold text-emerald-900">Resposta IA</p>
          <p className="mt-2 text-sm text-gray-700">
            {aiPrompt || `A IA está pronta para ajudar em ${t(`tools.${currentToolId}.title`)}. Selecione uma sugestão acima para começar.`}
          </p>
        </div>
      </section>

      <AdBanner slotId="tool-bottom" className="mt-8" />
    </div>
  );
}
