import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AgeCalculator() {
  const { t } = useTranslation();
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
  } | null>(null);

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
      <button
        onClick={calculateAge}
        className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
      >
        {t("common.calculate")}
      </button>

      {result && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="text-4xl font-bold text-emerald-600 mb-1">
              {result.years}
            </p>
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Years
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="text-4xl font-bold text-emerald-600 mb-1">
              {result.months}
            </p>
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Months
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="text-4xl font-bold text-emerald-600 mb-1">
              {result.days}
            </p>
            <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Days
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
