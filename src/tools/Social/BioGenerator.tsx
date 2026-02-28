import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";

export default function BioGenerator() {
  const { t } = useTranslation();
  const [profession, setProfession] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [vibe, setVibe] = useState("professional");
  const [generatedBio, setGeneratedBio] = useState("");
  const [copied, setCopied] = useState(false);

  const generateBio = () => {
    const templates = {
      professional: `Helping businesses grow through ${profession}. Passionate about ${hobbies}. Let's connect! 🚀`,
      creative: `✨ ${profession} by day, ${hobbies} enthusiast by night. Creating magic every day. ✨`,
      funny: `Professional ${profession}. I run on coffee and ${hobbies}. Probably thinking about food right now. 🍕`,
    };

    const bio =
      templates[vibe as keyof typeof templates] || templates.professional;
    setGeneratedBio(bio);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profession / Role
          </label>
          <input
            type="text"
            placeholder="e.g. Software Engineer"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hobbies / Interests
          </label>
          <input
            type="text"
            placeholder="e.g. photography, coffee"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vibe
        </label>
        <div className="flex gap-4">
          {["professional", "creative", "funny"].map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vibe"
                value={v}
                checked={vibe === v}
                onChange={(e) => setVibe(e.target.value)}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="capitalize text-gray-700">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={generateBio}
        className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
      >
        {t("common.generate")}
      </button>

      {generatedBio && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl relative group">
          <p className="text-gray-800 text-lg pr-12 whitespace-pre-wrap">
            {generatedBio}
          </p>
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
