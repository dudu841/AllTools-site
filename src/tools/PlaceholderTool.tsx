import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ToolId } from "../config/tools";

type Props = { toolId?: ToolId };
type Lang = "pt" | "en" | "es";
type FieldKey = "a" | "b" | "c" | "text";

type Localized = {
  labels: Partial<Record<FieldKey, string>>;
  placeholders: Partial<Record<FieldKey, string>>;
  steps: string[];
};

const common: Record<Lang, Record<string, string>> = {
  pt: {
    calculate: "Calcular",
    clear: "Limpar",
    result: "Resultado",
    optionalUpload: "Upload de arquivo (opcional)",
    uploadTitle: "Enviar arquivo",
    uploadHint: "Selecione ou arraste seu arquivo para começar.",
    detailedGuide: "Passo a passo desta ferramenta",
    interpretation: "Veja a interpretação do IMC",
    bmi: "Seu IMC",
    invalidNumber: "Número inválido",
    invalidExpression: "Expressão inválida",
    weak: "fraca",
    medium: "média",
    strong: "forte",
    finalPrice: "Preço final",
    margin: "Margem",
    markupPrice: "Preço com markup",
    installment: "Parcela mensal",
    netSalary: "Salário líquido",
    projected: "Valor projetado",
    words: "Palavras",
    strength: "Força",
    quickAnalysis: "Análise rápida para",
  },
  en: {
    calculate: "Calculate",
    clear: "Clear",
    result: "Result",
    optionalUpload: "File upload (optional)",
    uploadTitle: "Upload file",
    uploadHint: "Select or drag your file to start.",
    detailedGuide: "Step-by-step for this tool",
    interpretation: "See BMI interpretation",
    bmi: "Your BMI",
    invalidNumber: "Invalid number",
    invalidExpression: "Invalid expression",
    weak: "weak",
    medium: "medium",
    strong: "strong",
    finalPrice: "Final price",
    margin: "Margin",
    markupPrice: "Price with markup",
    installment: "Monthly installment",
    netSalary: "Net salary",
    projected: "Projected value",
    words: "Words",
    strength: "Strength",
    quickAnalysis: "Quick analysis for",
  },
  es: {
    calculate: "Calcular",
    clear: "Limpiar",
    result: "Resultado",
    optionalUpload: "Subir archivo (opcional)",
    uploadTitle: "Subir archivo",
    uploadHint: "Selecciona o arrastra tu archivo para comenzar.",
    detailedGuide: "Paso a paso de esta herramienta",
    interpretation: "Vea la interpretación del IMC",
    bmi: "Tu IMC",
    invalidNumber: "Número inválido",
    invalidExpression: "Expresión inválida",
    weak: "débil",
    medium: "media",
    strong: "fuerte",
    finalPrice: "Precio final",
    margin: "Margen",
    markupPrice: "Precio con markup",
    installment: "Cuota mensual",
    netSalary: "Salario neto",
    projected: "Valor proyectado",
    words: "Palabras",
    strength: "Fuerza",
    quickAnalysis: "Análisis rápido para",
  },
};



const uploadOnlyTools = new Set<ToolId>([
  "pdf-to-word",
  "word-to-pdf",
  "compress-pdf",
  "social-resizer",
  "meme-generator",
  "banner-thumbnail-creator",
]);


const toolUi: Partial<Record<ToolId, Record<Lang, Localized>>> = {
  "bmi-calculator": {
    pt: {
      labels: { a: "Altura (ex.: 1,70)", b: "Peso (ex.: 69,2)" },
      placeholders: { a: "Metros", b: "Quilos" },
      steps: [
        "Digite sua altura em metros (exemplo: 1,70).",
        "Digite seu peso em quilos (exemplo: 69,2).",
        "Clique em Calcular para ver o IMC automaticamente.",
        "Use a tabela de interpretação para entender sua classificação.",
      ],
    },
    en: {
      labels: { a: "Height (ex.: 1.70)", b: "Weight (ex.: 69.2)" },
      placeholders: { a: "Meters", b: "Kilograms" },
      steps: [
        "Enter your height in meters (example: 1.70).",
        "Enter your weight in kilograms (example: 69.2).",
        "Click Calculate to see your BMI instantly.",
        "Use the interpretation table to understand the result.",
      ],
    },
    es: {
      labels: { a: "Altura (ej.: 1,70)", b: "Peso (ej.: 69,2)" },
      placeholders: { a: "Metros", b: "Kilos" },
      steps: [
        "Ingresa tu altura en metros (ejemplo: 1,70).",
        "Ingresa tu peso en kilos (ejemplo: 69,2).",
        "Haz clic en Calcular para ver tu IMC al instante.",
        "Usa la tabla para interpretar tu clasificación.",
      ],
    },
  },

  "pdf-to-word": {
    pt: { labels: {}, placeholders: {}, steps: ["Clique em Enviar arquivo e selecione o PDF.", "Aguarde o processamento para conversão em Word.", "Revise o arquivo convertido e baixe o resultado."] },
    en: { labels: {}, placeholders: {}, steps: ["Click Upload file and choose your PDF.", "Wait for processing to convert to Word.", "Review and download the converted file."] },
    es: { labels: {}, placeholders: {}, steps: ["Haz clic en Subir archivo y elige tu PDF.", "Espera el procesamiento para convertir a Word.", "Revisa y descarga el archivo convertido."] },
  },
  "word-to-pdf": {
    pt: { labels: {}, placeholders: {}, steps: ["Clique em Enviar arquivo e selecione o documento Word.", "Aguarde a conversão para PDF.", "Baixe o PDF final pronto para compartilhar."] },
    en: { labels: {}, placeholders: {}, steps: ["Click Upload file and choose your Word document.", "Wait for the PDF conversion.", "Download the final PDF ready to share."] },
    es: { labels: {}, placeholders: {}, steps: ["Haz clic en Subir archivo y selecciona el documento Word.", "Espera la conversión a PDF.", "Descarga el PDF final listo para compartir."] },
  },
  "compress-pdf": {
    pt: { labels: {}, placeholders: {}, steps: ["Clique em Enviar arquivo para selecionar o PDF.", "A ferramenta compacta automaticamente mantendo a qualidade possível.", "Baixe o PDF compactado no final do processo."] },
    en: { labels: {}, placeholders: {}, steps: ["Click Upload file to select your PDF.", "The tool compresses automatically while preserving quality.", "Download the compressed PDF after processing."] },
    es: { labels: {}, placeholders: {}, steps: ["Haz clic en Subir archivo para seleccionar tu PDF.", "La herramienta comprime automáticamente manteniendo calidad.", "Descarga el PDF comprimido al finalizar."] },
  },
  "social-resizer": {
    pt: { labels: {}, placeholders: {}, steps: ["Envie sua imagem na área de upload.", "Escolha o formato de rede social desejado (Instagram, TikTok etc.).", "Baixe a versão redimensionada com proporção correta."] },
    en: { labels: {}, placeholders: {}, steps: ["Upload your image in the upload area.", "Choose the target social format (Instagram, TikTok, etc.).", "Download the resized version with correct ratio."] },
    es: { labels: {}, placeholders: {}, steps: ["Sube tu imagen en el área de carga.", "Elige el formato de red social (Instagram, TikTok, etc.).", "Descarga la versión redimensionada con proporción correcta."] },
  },
  "meme-generator": {
    pt: { labels: {}, placeholders: {}, steps: ["Envie a imagem base do meme.", "Adicione os textos superior e inferior no editor da ferramenta.", "Gere e baixe o meme final para compartilhar."] },
    en: { labels: {}, placeholders: {}, steps: ["Upload your meme base image.", "Add top and bottom text in the tool editor.", "Generate and download the final meme."] },
    es: { labels: {}, placeholders: {}, steps: ["Sube la imagen base del meme.", "Agrega texto superior e inferior en el editor.", "Genera y descarga el meme final."] },
  },
  "banner-thumbnail-creator": {
    pt: { labels: {}, placeholders: {}, steps: ["Envie imagem ou arte base.", "Escolha tamanho/layout de banner ou miniatura.", "Exporte o arquivo final otimizado para publicação."] },
    en: { labels: {}, placeholders: {}, steps: ["Upload your base image/artwork.", "Choose banner or thumbnail size/layout.", "Export the final optimized file."] },
    es: { labels: {}, placeholders: {}, steps: ["Sube tu imagen o diseño base.", "Elige tamaño y diseño de banner o miniatura.", "Exporta el archivo final optimizado."] },
  },
  "calorie-calculator": {
    pt: {
      labels: { a: "Altura (cm)", b: "Peso (kg)", c: "Idade (anos)" },
      placeholders: { a: "Ex.: 170", b: "Ex.: 69", c: "Ex.: 30" },
      steps: [
        "Informe sua altura em centímetros.",
        "Informe seu peso e sua idade.",
        "Escolha o nível de atividade nos modos (Básico/Intermediário/Avançado).",
        "Clique em Calcular para ver calorias estimadas por dia.",
      ],
    },
    en: { labels: { a: "Height (cm)", b: "Weight (kg)", c: "Age (years)" }, placeholders: { a: "Ex.: 170", b: "Ex.: 69", c: "Ex.: 30" }, steps: ["Enter your height in centimeters.", "Enter your weight and age.", "The daily estimate uses a standard activity factor.", "Click Calculate to get estimated daily calories."] },
    es: { labels: { a: "Altura (cm)", b: "Peso (kg)", c: "Edad (años)" }, placeholders: { a: "Ej.: 170", b: "Ej.: 69", c: "Ej.: 30" }, steps: ["Ingresa tu altura en centímetros.", "Ingresa tu peso y edad.", "La estimación diaria usa un factor de actividad estándar.", "Haz clic en Calcular para ver calorías diarias estimadas."] },
  },
  "word-counter": {
    pt: { labels: { text: "Texto" }, placeholders: { text: "Cole aqui o texto completo" }, steps: ["Cole ou digite o texto no campo.", "Revise o conteúdo antes de calcular.", "Clique em Calcular para contar as palavras.", "Use o resultado para revisar tamanho de texto/SEO."] },
    en: { labels: { text: "Text" }, placeholders: { text: "Paste your full text here" }, steps: ["Paste or type your text.", "Review content before calculating.", "Click Calculate to count words.", "Use the result for content/SEO size checks."] },
    es: { labels: { text: "Texto" }, placeholders: { text: "Pega aquí el texto completo" }, steps: ["Pega o escribe el texto.", "Revisa el contenido antes de calcular.", "Haz clic en Calcular para contar palabras.", "Usa el resultado para tamaño de contenido/SEO."] },
  },
};

const defaultUi: Record<Lang, Localized> = {
  pt: {
    labels: { a: "Valor 1", b: "Valor 2", c: "Valor 3", text: "Texto / URL" },
    placeholders: { a: "Digite o primeiro valor", b: "Digite o segundo valor", c: "Digite o terceiro valor", text: "Digite texto, URL ou expressão" },
    steps: [
      "Leia o título da ferramenta para saber o objetivo.",
      "Preencha os campos com os dados solicitados.",
      "Preencha todos os campos exigidos pela ferramenta.",
      "Clique em Calcular para gerar o resultado automaticamente.",
    ],
  },
  en: {
    labels: { a: "Value 1", b: "Value 2", c: "Value 3", text: "Text / URL" },
    placeholders: { a: "Enter first value", b: "Enter second value", c: "Enter third value", text: "Type text, URL or expression" },
    steps: ["Read the tool title to understand the goal.", "Fill in requested fields.", "Fill the required fields shown for the tool.", "Click Calculate to generate the result."],
  },
  es: {
    labels: { a: "Valor 1", b: "Valor 2", c: "Valor 3", text: "Texto / URL" },
    placeholders: { a: "Ingresa el primer valor", b: "Ingresa el segundo valor", c: "Ingresa el tercer valor", text: "Escribe texto, URL o expresión" },
    steps: ["Lee el título para entender el objetivo.", "Completa los campos solicitados.", "Completa todos los campos requeridos por la herramienta.", "Haz clic en Calcular para generar el resultado."],
  },
};

function capitalizeWords(value: string) {
  return value.toLowerCase().split(" ").map((word) => (word ? word[0].toUpperCase() + word.slice(1) : "")).join(" ");
}

function getPasswordStrength(password: string, langCommon: Record<string, string>) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return langCommon.weak;
  if (score <= 4) return langCommon.medium;
  return langCommon.strong;
}

export default function PlaceholderTool({ toolId }: Props) {
  const { i18n } = useTranslation();
  const lang = ((i18n.language || "pt").split("-")[0] as Lang) || "pt";
  const l = common[lang] ?? common.pt;
  const currentUi = toolId ? toolUi[toolId]?.[lang] ?? defaultUi[lang] : defaultUi[lang];
  const isUploadOnly = toolId ? uploadOnlyTools.has(toolId) : false;

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [text, setText] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [result, setResult] = useState("-");

  const bmiClassification = useMemo(() => {
    const value = Number(result);
    if (Number.isNaN(value)) return "-";
    if (value < 18.5) return lang === "pt" ? "Magreza" : lang === "es" ? "Bajo peso" : "Underweight";
    if (value < 25) return lang === "pt" ? "Normal" : lang === "es" ? "Normal" : "Normal";
    if (value < 30) return lang === "pt" ? "Sobrepeso" : lang === "es" ? "Sobrepeso" : "Overweight";
    if (value < 40) return lang === "pt" ? "Obesidade" : lang === "es" ? "Obesidad" : "Obesity";
    return lang === "pt" ? "Obesidade grave" : lang === "es" ? "Obesidad grave" : "Severe obesity";
  }, [result, lang]);

  const calculate = () => {
    const nA = Number(String(a).replace(",", "."));
    const nB = Number(String(b).replace(",", "."));
    const nC = Number(String(c).replace(",", "."));

    let nextResult = "-";

    switch (toolId) {
      case "bmi-calculator": {
        if (!nA || !nB) break;
        nextResult = (nB / (nA * nA)).toFixed(2);
        break;
      }
      case "calorie-calculator": {
        if (!nA || !nB || !nC) break;
        const bmr = 10 * nB + 6.25 * nA - 5 * nC + 5;
        const activityFactor = 1.375;
        nextResult = `${Math.round(bmr * activityFactor)} kcal/dia`;
        break;
      }
      case "mortgage-calculator": {
        if (!nA || !nB || !nC) break;
        const monthlyRate = nB / 100 / 12;
        const totalMonths = nC * 12;
        const installment = (nA * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        nextResult = `${l.installment}: ${installment.toFixed(2)}`;
        break;
      }
      case "net-gross-salary":
        nextResult = nA ? `${l.netSalary}: ${(nA * (1 - nB / 100)).toFixed(2)}` : "-";
        break;
      case "discount-margin-markup": {
        if (!nA) break;
        nextResult = `${l.finalPrice}: ${(nA * (1 - nB / 100)).toFixed(2)}`;
        break;
      }
      case "travel-time-calculator":
        nextResult = nA && nB ? `${(nA / nB).toFixed(2)} h` : "-";
        break;
      case "apr-monthly-converter":
        if (nA) nextResult = `${(((1 + nA / 100) ** (1 / 12) - 1) * 100).toFixed(4)}% a.m.`;
        break;
      case "stock-simulator":
      case "investment-simulator":
        nextResult = nA && nB && nC ? `${l.projected}: ${(nA * Math.pow(1 + nB / 100, nC)).toFixed(2)}` : "-";
        break;
      case "word-counter":
        nextResult = `${l.words}: ${text.trim() ? text.trim().split(/\s+/).length : 0}`;
        break;
      case "text-case-converter":
        nextResult = capitalizeWords(text);
        break;
      case "password-strength-checker":
        nextResult = `${l.strength}: ${getPasswordStrength(text, l)}`;
        break;
      case "encrypt-decrypt": {
        const shift = nA || 3;
        const operation = shift;
        nextResult = text.replace(/[a-z]/gi, (char) => {
          const base = char <= "Z" ? 65 : 97;
          const code = (((char.charCodeAt(0) - base + operation) % 26) + 26) % 26;
          return String.fromCharCode(base + code);
        });
        break;
      }
      case "base-converter": {
        if (!text) break;
        const parsed = parseInt(text, Number(a || 10));
        nextResult = Number.isNaN(parsed) ? l.invalidNumber : parsed.toString(Number(b || 2));
        break;
      }
      case "scientific-calculator": {
        if (!text) break;
        try {
          // eslint-disable-next-line no-new-func
          nextResult = String(Function(`"use strict"; return (${text})`)());
        } catch {
          nextResult = l.invalidExpression;
        }
        break;
      }
      case "currency-converter":
        nextResult = nA && nB ? `${(nA * nB).toFixed(2)}` : "-";
        break;
      case "cm-inch-converter":
        nextResult = nA ? `${(nA / 2.54).toFixed(2)} in` : "-";
        break;
      case "kg-lbs-converter":
        nextResult = nA ? `${(nA * 2.20462).toFixed(2)} lbs` : "-";
        break;
      case "sqm-sqft-converter":
        nextResult = nA ? `${(nA * 10.7639).toFixed(2)} ft²` : "-";
        break;
      case "backlink-counter":
      case "rank-checker":
      case "meta-tags-checker":
      case "html-css-validator":
      case "site-speed-checker":
        nextResult = text ? `${l.quickAnalysis}: ${text}` : "-";
        break;
      default:
        nextResult = text || "-";
    }

    setResult(nextResult);
  };

  const clear = () => {
    setA("");
    setB("");
    setC("");
    setText("");
    setResult("-");
  };

  const renderField = (field: FieldKey, value: string, setValue: (value: string) => void) => {
    if (!currentUi.labels[field]) return null;

    return (
      <label className="block" key={field}>
        <span className="mb-1 block text-sm font-semibold text-gray-700">{currentUi.labels[field]}</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={currentUi.placeholders[field]}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </label>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {isUploadOnly ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-800">{l.uploadTitle}</p>
          <p className="mt-1 text-sm text-gray-600">{l.uploadHint}</p>
          <input type="file" className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("a", a, setA)}
            {renderField("b", b, setB)}
            {renderField("c", c, setC)}
            {renderField("text", text, setText)}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={calculate} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">{l.calculate}</button>
            <button type="button" onClick={clear} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">{l.clear}</button>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
            <p className="font-semibold">{l.result}</p>
            <p className="mt-1 break-words">{result}</p>
            {toolId === "bmi-calculator" && result !== "-" && <p className="mt-2 text-sm font-medium">{l.bmi}: {result} ({bmiClassification})</p>}
          </div>
        </>
      )}

      {toolId === "bmi-calculator" && (
        <div className="overflow-hidden rounded-xl border border-blue-200">
          <div className="bg-blue-700 px-4 py-3 text-sm font-semibold text-white">{l.interpretation}</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50 text-blue-800">
              <tr>
                <th className="px-4 py-2">IMC</th>
                <th className="px-4 py-2">{lang === "pt" ? "Classificação" : lang === "es" ? "Clasificación" : "Classification"}</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              <tr><td className="px-4 py-2">&lt; 18,5</td><td className="px-4 py-2">{lang === "pt" ? "Magreza" : lang === "es" ? "Bajo peso" : "Underweight"}</td></tr>
              <tr><td className="px-4 py-2">18,5 - 24,9</td><td className="px-4 py-2">{lang === "pt" ? "Normal" : "Normal"}</td></tr>
              <tr><td className="px-4 py-2">25,0 - 29,9</td><td className="px-4 py-2">{lang === "pt" ? "Sobrepeso" : lang === "es" ? "Sobrepeso" : "Overweight"}</td></tr>
              <tr><td className="px-4 py-2">30,0 - 39,9</td><td className="px-4 py-2">{lang === "pt" ? "Obesidade" : lang === "es" ? "Obesidad" : "Obesity"}</td></tr>
              <tr><td className="px-4 py-2">≥ 40,0</td><td className="px-4 py-2">{lang === "pt" ? "Obesidade grave" : lang === "es" ? "Obesidad grave" : "Severe obesity"}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900">{l.detailedGuide}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          {currentUi.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      {!isUploadOnly && (
        <div className="rounded-xl border border-gray-200 p-4">
          <button onClick={() => setShowUpload((state) => !state)} className="text-sm font-medium text-emerald-700 underline" type="button">
            {l.optionalUpload}
          </button>
          {showUpload && <input type="file" className="mt-3 w-full" />}
        </div>
      )}
    </div>
  );
}
