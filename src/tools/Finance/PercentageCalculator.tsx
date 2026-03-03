import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { parseLocaleNumber } from "../../utils/number";

export default function PercentageCalculator() {
  const { t } = useTranslation();
  const [percentInput, setPercentInput] = useState("20");
  const [numberInput, setNumberInput] = useState("150");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const percent = parseLocaleNumber(percentInput);
    const number = parseLocaleNumber(numberInput);
    if (!Number.isFinite(percent) || !Number.isFinite(number)) {
      setError("Preencha números válidos.");
      setResult(null);
      return;
    }
    setError("");
    setResult((percent / 100) * number);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.percentage-calculator.fields.whatIs")}</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={percentInput}
              onChange={(e) => setPercentInput(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">%</span>
          </div>
        </div>
        <div className="flex-none pt-7 font-medium text-gray-500">{t("tools.percentage-calculator.fields.of")}</div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.percentage-calculator.fields.number")}</label>
          <input
            type="text"
            inputMode="decimal"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
      >
        {t("common.calculate")}
      </button>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {result !== null && (
        <div className="mt-8 p-6 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-lg font-medium text-emerald-800 mb-2">{t("common.result")}</h3>
          <p className="text-4xl font-bold text-emerald-600">{result}</p>
        </div>
      )}
    </div>
  );
}
