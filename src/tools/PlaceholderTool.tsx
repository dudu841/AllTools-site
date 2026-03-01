import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ToolId } from "../config/tools";

type Props = { toolId?: ToolId };
type Lang = "pt" | "en" | "es";

const uiText: Record<Lang, Record<string, string>> = {
  pt: {
    value1: "Valor 1",
    value2: "Valor 2",
    value3: "Valor 3",
    text: "Texto / URL / expressão",
    invalidNumber: "Número inválido",
    invalidExpression: "Expressão inválida",
    weak: "fraca",
    medium: "média",
    strong: "forte",
    finalPrice: "Preço final",
    margin: "Margem",
    markupPrice: "Preço com markup",
    installment: "Parcela",
    netSalary: "Salário líquido",
    projected: "Valor projetado",
    words: "Palavras",
    strength: "Força",
    quickAnalysis: "Análise rápida para",
    uploadOptional: "Upload de arquivo (opcional)",
    modes: "Modos",
  },
  en: {
    value1: "Value 1",
    value2: "Value 2",
    value3: "Value 3",
    text: "Text / URL / expression",
    invalidNumber: "Invalid number",
    invalidExpression: "Invalid expression",
    weak: "weak",
    medium: "medium",
    strong: "strong",
    finalPrice: "Final price",
    margin: "Margin",
    markupPrice: "Price with markup",
    installment: "Installment",
    netSalary: "Net salary",
    projected: "Projected value",
    words: "Words",
    strength: "Strength",
    quickAnalysis: "Quick analysis for",
    uploadOptional: "File upload (optional)",
    modes: "Modes",
  },
  es: {
    value1: "Valor 1",
    value2: "Valor 2",
    value3: "Valor 3",
    text: "Texto / URL / expresión",
    invalidNumber: "Número inválido",
    invalidExpression: "Expresión inválida",
    weak: "débil",
    medium: "media",
    strong: "fuerte",
    finalPrice: "Precio final",
    margin: "Margen",
    markupPrice: "Precio con markup",
    installment: "Cuota",
    netSalary: "Salario neto",
    projected: "Valor proyectado",
    words: "Palabras",
    strength: "Fuerza",
    quickAnalysis: "Análisis rápido para",
    uploadOptional: "Subir archivo (opcional)",
    modes: "Modos",
  },
};

const modeLabels: Record<Lang, Record<string, string>> = {
  pt: {
    basic: "Básico",
    advanced: "Avançado",
    pro: "Profissional",
    discount: "Desconto",
    margin: "Margem",
    markup: "Markup",
    aprToMonth: "APR → Mensal",
    monthToApr: "Mensal → APR",
    upper: "MAIÚSCULAS",
    lower: "minúsculas",
    capitalize: "Capitalizar",
    encrypt: "Criptografar",
    decrypt: "Descriptografar",
    cmInch: "cm → in",
    inchCm: "in → cm",
    kgLbs: "kg → lbs",
    lbsKg: "lbs → kg",
    sqmSqft: "m² → ft²",
    sqftSqm: "ft² → m²",
  },
  en: {
    basic: "Basic",
    advanced: "Advanced",
    pro: "Pro",
    discount: "Discount",
    margin: "Margin",
    markup: "Markup",
    aprToMonth: "APR → Monthly",
    monthToApr: "Monthly → APR",
    upper: "UPPERCASE",
    lower: "lowercase",
    capitalize: "Capitalize",
    encrypt: "Encrypt",
    decrypt: "Decrypt",
    cmInch: "cm → in",
    inchCm: "in → cm",
    kgLbs: "kg → lbs",
    lbsKg: "lbs → kg",
    sqmSqft: "m² → ft²",
    sqftSqm: "ft² → m²",
  },
  es: {
    basic: "Básico",
    advanced: "Avanzado",
    pro: "Profesional",
    discount: "Descuento",
    margin: "Margen",
    markup: "Markup",
    aprToMonth: "APR → Mensual",
    monthToApr: "Mensual → APR",
    upper: "MAYÚSCULAS",
    lower: "minúsculas",
    capitalize: "Capitalizar",
    encrypt: "Encriptar",
    decrypt: "Desencriptar",
    cmInch: "cm → in",
    inchCm: "in → cm",
    kgLbs: "kg → lbs",
    lbsKg: "lbs → kg",
    sqmSqft: "m² → ft²",
    sqftSqm: "ft² → m²",
  },
};

const modeOptions: Array<{ value: string; labelKey: string }> = [
  { value: "1", labelKey: "basic" },
  { value: "2", labelKey: "advanced" },
  { value: "3", labelKey: "pro" },
  { value: "discount", labelKey: "discount" },
  { value: "margin", labelKey: "margin" },
  { value: "markup", labelKey: "markup" },
  { value: "apr-to-month", labelKey: "aprToMonth" },
  { value: "month-to-apr", labelKey: "monthToApr" },
  { value: "upper", labelKey: "upper" },
  { value: "lower", labelKey: "lower" },
  { value: "capitalize", labelKey: "capitalize" },
  { value: "encrypt", labelKey: "encrypt" },
  { value: "decrypt", labelKey: "decrypt" },
  { value: "cm-inch", labelKey: "cmInch" },
  { value: "inch-cm", labelKey: "inchCm" },
  { value: "kg-lbs", labelKey: "kgLbs" },
  { value: "lbs-kg", labelKey: "lbsKg" },
  { value: "sqm-sqft", labelKey: "sqmSqft" },
  { value: "sqft-sqm", labelKey: "sqftSqm" },
];

function capitalizeWords(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

function passwordStrength(password: string, text: Record<string, string>) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return text.weak;
  if (score <= 4) return text.medium;
  return text.strong;
}

export default function PlaceholderTool({ toolId }: Props) {
  const { t, i18n } = useTranslation();
  const lang = ((i18n.language || "pt").split("-")[0] as Lang) || "pt";
  const textMap = uiText[lang] ?? uiText.pt;
  const labels = modeLabels[lang] ?? modeLabels.pt;

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState("1");
  const [showUpload, setShowUpload] = useState(false);

  const nA = Number(a || 0);
  const nB = Number(b || 0);
  const nC = Number(c || 0);

  const result = useMemo(() => {
    switch (toolId) {
      case "bmi-calculator": {
        const heightM = nA / 100;
        if (!heightM || !nB) return "-";
        return (nB / (heightM * heightM)).toFixed(2);
      }
      case "calorie-calculator": {
        if (!nA || !nB || !nC) return "-";
        const bmr = 10 * nB + 6.25 * nA - 5 * nC + 5;
        const factors = [1.2, 1.375, 1.55, 1.725];
        return `${Math.round(bmr * factors[Math.min(Number(mode), 3)])} kcal/dia`;
      }
      case "mortgage-calculator": {
        if (!nA || !nB || !nC) return "-";
        const monthlyRate = nB / 100 / 12;
        const totalMonths = nC * 12;
        const monthlyInstallment =
          (nA * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        return `${textMap.installment}: ${monthlyInstallment.toFixed(2)}`;
      }
      case "net-gross-salary": {
        if (!nA) return "-";
        const netSalary = nA * (1 - nB / 100);
        return `${textMap.netSalary}: ${netSalary.toFixed(2)}`;
      }
      case "discount-margin-markup": {
        if (!nA) return "-";
        if (mode === "discount") return `${textMap.finalPrice}: ${(nA * (1 - nB / 100)).toFixed(2)}`;
        if (mode === "margin") return `${textMap.margin}: ${(((nA - nB) / nA) * 100 || 0).toFixed(2)}%`;
        return `${textMap.markupPrice}: ${(nA * (1 + nB / 100)).toFixed(2)}`;
      }
      case "travel-time-calculator": {
        if (!nA || !nB) return "-";
        return `${(nA / nB).toFixed(2)} h`;
      }
      case "apr-monthly-converter": {
        if (!nA) return "-";
        if (mode === "apr-to-month") return `${(((1 + nA / 100) ** (1 / 12) - 1) * 100).toFixed(4)}% a.m.`;
        return `${(((1 + nA / 100) ** 12 - 1) * 100).toFixed(4)}% a.a.`;
      }
      case "stock-simulator":
      case "investment-simulator": {
        if (!nA || !nB || !nC) return "-";
        const projected = nA * Math.pow(1 + nB / 100, nC);
        return `${textMap.projected}: ${projected.toFixed(2)}`;
      }
      case "word-counter": {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        return `${textMap.words}: ${words}`;
      }
      case "text-case-converter": {
        if (mode === "upper") return text.toUpperCase();
        if (mode === "capitalize") return capitalizeWords(text);
        return text.toLowerCase();
      }
      case "password-strength-checker":
        return `${textMap.strength}: ${passwordStrength(text, textMap)}`;
      case "encrypt-decrypt": {
        const shift = nA || 3;
        const operation = mode === "decrypt" ? -shift : shift;
        return text.replace(/[a-z]/gi, (char) => {
          const base = char <= "Z" ? 65 : 97;
          const code = (((char.charCodeAt(0) - base + operation) % 26) + 26) % 26;
          return String.fromCharCode(base + code);
        });
      }
      case "base-converter": {
        if (!text) return "-";
        const fromBase = Number(a || 10);
        const toBase = Number(b || 2);
        const parsed = parseInt(text, fromBase);
        if (Number.isNaN(parsed)) return textMap.invalidNumber;
        return parsed.toString(toBase);
      }
      case "scientific-calculator": {
        if (!text) return "-";
        try {
          // eslint-disable-next-line no-new-func
          const output = Function(`"use strict"; return (${text})`)();
          return String(output);
        } catch {
          return textMap.invalidExpression;
        }
      }
      case "currency-converter": {
        if (!nA || !nB) return "-";
        return `${(nA * nB).toFixed(2)}`;
      }
      case "cm-inch-converter": {
        if (!nA) return "-";
        return mode === "cm-inch" ? `${(nA / 2.54).toFixed(2)} in` : `${(nA * 2.54).toFixed(2)} cm`;
      }
      case "kg-lbs-converter": {
        if (!nA) return "-";
        return mode === "kg-lbs" ? `${(nA * 2.20462).toFixed(2)} lbs` : `${(nA / 2.20462).toFixed(2)} kg`;
      }
      case "sqm-sqft-converter": {
        if (!nA) return "-";
        return mode === "sqm-sqft" ? `${(nA * 10.7639).toFixed(2)} ft²` : `${(nA / 10.7639).toFixed(2)} m²`;
      }
      case "backlink-counter":
      case "rank-checker":
      case "meta-tags-checker":
      case "html-css-validator":
      case "site-speed-checker":
        return text ? `${textMap.quickAnalysis}: ${text}` : "-";
      default:
        return text || "-";
    }
  }, [toolId, nA, nB, nC, text, mode, textMap]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input value={a} onChange={(event) => setA(event.target.value)} placeholder={textMap.value1} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
        <input value={b} onChange={(event) => setB(event.target.value)} placeholder={textMap.value2} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
        <input value={c} onChange={(event) => setC(event.target.value)} placeholder={textMap.value3} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder={textMap.text} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">{textMap.modes}</p>
        <div className="flex flex-wrap gap-2">
          {modeOptions.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-lg border px-3 py-1 ${mode === value ? "bg-emerald-600 text-white" : "bg-white"}`}
              type="button"
            >
              {labels[labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
        <p className="font-semibold">{t("common.result")}</p>
        <p className="mt-1 break-words">{result}</p>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <button
          onClick={() => setShowUpload((state) => !state)}
          className="text-sm font-medium text-emerald-700 underline"
          type="button"
        >
          {textMap.uploadOptional}
        </button>
        {showUpload && <input type="file" className="mt-3 w-full" />}
      </div>
    </div>
  );
}
