import React from "react";
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

const toolComponents: Record<ToolId, React.FC> = {
  "pdf-to-word": PlaceholderTool,
  "word-to-pdf": PlaceholderTool,
  "compress-pdf": PlaceholderTool,
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
};

export default function ToolWrapper() {
  const { lang, toolPath } = useParams<{ lang: string; toolPath: string }>();
  const { t, i18n } = useTranslation();

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

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Helmet>
        <title>{t(`tools.${currentToolId}.title`)} | AllTools</title>
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

      <AdBanner slotId="tool-bottom" className="mt-8" />
    </div>
  );
}
