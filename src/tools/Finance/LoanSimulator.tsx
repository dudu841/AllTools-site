import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoanSimulator() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(5);
  const [months, setMonths] = useState<number>(60);
  const [result, setResult] = useState<{
    monthly: number;
    total: number;
    interest: number;
  } | null>(null);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = months;
    const monthly =
      (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - amount;
    setResult({ monthly, total, interest });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
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
          Loan Term (Months)
        </label>
        <input
          type="number"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
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
        <div className="mt-8 p-6 bg-emerald-50 rounded-xl space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-emerald-800 mb-1">
              Monthly Payment
            </h3>
            <p className="text-3xl font-bold text-emerald-600">
              ${result.monthly.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200">
            <div className="text-center">
              <h4 className="text-xs font-medium text-emerald-800 mb-1">
                Total Interest
              </h4>
              <p className="text-lg font-semibold text-emerald-600">
                ${result.interest.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-medium text-emerald-800 mb-1">
                Total Payment
              </h4>
              <p className="text-lg font-semibold text-emerald-600">
                ${result.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
