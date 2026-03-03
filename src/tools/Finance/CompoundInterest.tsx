import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { parseLocaleNumber } from "../../utils/number";

export default function CompoundInterest() {
  const { t } = useTranslation();
  const [principalInput, setPrincipalInput] = useState("1000");
  const [rateInput, setRateInput] = useState("5");
  const [yearsInput, setYearsInput] = useState("10");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const principal = parseLocaleNumber(principalInput);
    const rate = parseLocaleNumber(rateInput);
    const years = parseLocaleNumber(yearsInput);

    if (!Number.isFinite(principal) || !Number.isFinite(rate) || !Number.isFinite(years) || principal < 0 || years < 0) {
      setError("Preencha valores válidos.");
      setResult(null);
      return;
    }

    setError("");
    const amount = principal * Math.pow(1 + rate / 100, years);
    setResult(amount);
  };

  const parsedPrincipal = parseLocaleNumber(principalInput);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("tools.compound-interest.fields.initialInvestment")}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={principalInput}
          onChange={(e) => setPrincipalInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("tools.compound-interest.fields.annualRate")}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={rateInput}
          onChange={(e) => setRateInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("tools.compound-interest.fields.years")}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={yearsInput}
          onChange={(e) => setYearsInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
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
          <p className="text-4xl font-bold text-emerald-600">${result.toFixed(2)}</p>
          <p className="text-sm text-emerald-600 mt-2">
            {t("tools.compound-interest.totalInterest")}: ${
              (result - (Number.isFinite(parsedPrincipal) ? parsedPrincipal : 0)).toFixed(2)
            }
          </p>
        </div>
      )}
    </div>
  );
}
