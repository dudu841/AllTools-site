import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CharacterCounter() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lines = text === "" ? 0 : text.split("\n").length;
    const paragraphs =
      text === ""
        ? 0
        : text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;

    setStats({ chars, charsNoSpaces, words, lines, paragraphs });
  }, [text]);

  const clearText = () => setText("");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Characters", value: stats.chars },
          { label: "Words", value: stats.words },
          { label: "Lines", value: stats.lines },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "No Spaces", value: stats.charsNoSpaces },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
          >
            <p className="text-3xl font-bold text-emerald-600 mb-1">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y font-sans text-gray-800"
        />
        {text && (
          <button
            onClick={clearText}
            className="absolute bottom-4 right-4 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t("common.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
