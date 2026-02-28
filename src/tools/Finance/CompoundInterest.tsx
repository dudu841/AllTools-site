import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CompoundInterest() {
  const { t } = useTranslation();
  const [principal, setPrincipal] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const amount = principal * Math.pow(1 + rate / 100, years);
    setResult(amount);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Investment
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Annual Interest Rate (%)
        </label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years to Grow
        </label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
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
          <p className="text-4xl font-bold text-emerald-600">
            ${result.toFixed(2)}
          </p>
          <p className="text-sm text-emerald-600 mt-2">
            Total interest earned: ${(result - principal).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
