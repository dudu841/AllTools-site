import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { parseLocaleNumber } from "../../utils/number";

export default function LoanSimulator() {
  const { t } = useTranslation();
  const [amountInput, setAmountInput] = useState("10000");
  const [rateInput, setRateInput] = useState("5");
  const [monthsInput, setMonthsInput] = useState("60");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const amount = parseLocaleNumber(amountInput);
    const rate = parseLocaleNumber(rateInput);
    const months = parseLocaleNumber(monthsInput);

    if (!Number.isFinite(amount) || !Number.isFinite(rate) || !Number.isFinite(months) || months <= 0 || amount < 0) {
      setError("Preencha valores válidos.");
      setResult(null);
      return;
    }

    setError("");
    const r = rate / 100 / 12;
    const n = Math.round(months);
    const monthly = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - amount;
    setResult({ monthly, total, interest });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.loan-simulator.fields.amount")}</label>
        <input
          type="text"
          inputMode="decimal"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.loan-simulator.fields.annualRate")}</label>
        <input
          type="text"
          inputMode="decimal"
          value={rateInput}
          onChange={(e) => setRateInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.loan-simulator.fields.termMonths")}</label>
        <input
          type="text"
          inputMode="numeric"
          value={monthsInput}
          onChange={(e) => setMonthsInput(e.target.value)}
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
        <div className="mt-8 p-6 bg-emerald-50 rounded-xl space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-emerald-800 mb-1">{t("tools.loan-simulator.results.monthlyPayment")}</h3>
            <p className="text-3xl font-bold text-emerald-600">${result.monthly.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
            <div className="text-center">
              <h4 className="text-xs font-medium text-emerald-800 mb-1">{t("tools.loan-simulator.results.totalInterest")}</h4>
              <p className="text-lg font-semibold text-emerald-600">${result.interest.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-medium text-emerald-800 mb-1">{t("tools.loan-simulator.results.totalPayment")}</h4>
              <p className="text-lg font-semibold text-emerald-600">${result.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
