import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PercentageCalculator() {
  const { t } = useTranslation();
  const [percent, setPercent] = useState<number>(20);
  const [number, setNumber] = useState<number>(150);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult((percent / 100) * number);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is
          </label>
          <div className="relative">
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">%</span>
          </div>
        </div>
        <div className="flex-none pt-7 font-medium text-gray-500">of</div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
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

      {result !== null && (
        <div className="mt-8 p-6 bg-emerald-50 rounded-xl text-center">
          <h3 className="text-lg font-medium text-emerald-800 mb-2">
            {t("common.result")}
          </h3>
          <p className="text-4xl font-bold text-emerald-600">{result}</p>
        </div>
      )}
    </div>
  );
}
