import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";

export default function HashtagGenerator() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateHashtags = () => {
    if (!keyword.trim()) return;

    const baseWords = keyword.split(" ").filter(Boolean);
    const generated = [
      ...baseWords.map((w) => `#${w.toLowerCase()}`),
      ...baseWords.map((w) => `#${w.toLowerCase()}life`),
      ...baseWords.map((w) => `#${w.toLowerCase()}love`),
      ...baseWords.map((w) => `#${w.toLowerCase()}style`),
      ...baseWords.map((w) => `#${w.toLowerCase()}tips`),
      ...baseWords.map((w) => `#instadaily`),
      ...baseWords.map((w) => `#explorepage`),
      ...baseWords.map((w) => `#trending`),
    ];

    // Shuffle and pick 15
    const shuffled = generated.sort(() => 0.5 - Math.random());
    setHashtags(shuffled.slice(0, 15));
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter a keyword or topic
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. travel, fitness, coding"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateHashtags()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            onClick={generateHashtags}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            {t("common.generate")}
          </button>
        </div>
      </div>

      {hashtags.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl relative">
          <div className="flex flex-wrap gap-2 pr-12">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-emerald-700 font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title={t("common.copy")}
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
