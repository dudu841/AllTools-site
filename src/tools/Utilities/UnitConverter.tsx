import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRightLeft } from "lucide-react";

const units = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
  },
  weight: {
    kilograms: 1,
    grams: 0.001,
    milligrams: 0.000001,
    pounds: 0.453592,
    ounces: 0.0283495,
  },
  temperature: {
    celsius: "C",
    fahrenheit: "F",
    kelvin: "K",
  },
};

export default function UnitConverter() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<keyof typeof units>("length");
  const [fromUnit, setFromUnit] = useState<string>("meters");
  const [toUnit, setToUnit] = useState<string>("feet");
  const [value, setValue] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);

  const convert = () => {
    if (category === "temperature") {
      let tempC = value;
      if (fromUnit === "fahrenheit") tempC = ((value - 32) * 5) / 9;
      if (fromUnit === "kelvin") tempC = value - 273.15;

      let finalTemp = tempC;
      if (toUnit === "fahrenheit") finalTemp = (tempC * 9) / 5 + 32;
      if (toUnit === "kelvin") finalTemp = tempC + 273.15;

      setResult(finalTemp);
    } else {
      const baseValue = value * (units[category] as any)[fromUnit];
      const finalValue = baseValue / (units[category] as any)[toUnit];
      setResult(finalValue);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as keyof typeof units;
    setCategory(newCat);
    const keys = Object.keys(units[newCat]);
    setFromUnit(keys[0]);
    setToUnit(keys[1]);
    setResult(null);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-medium text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 capitalize"
        >
          {Object.keys(units).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <div className="space-y-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 capitalize"
          >
            {Object.keys(units[category]).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-full h-[58px] px-4 py-3 text-2xl font-bold text-center bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-emerald-600 overflow-hidden">
            {result !== null
              ? result.toLocaleString(undefined, { maximumFractionDigits: 4 })
              : "-"}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 capitalize"
          >
            {Object.keys(units[category]).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={convert}
          className="w-full py-4 bg-emerald-600 text-white text-lg font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          {t("common.convert")}
        </button>
      </div>
    </div>
  );
}
