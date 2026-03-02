import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ToolId } from "../config/tools";

type Props = { toolId?: ToolId };
type Lang = "pt" | "en" | "es";

type FieldType = "text" | "number" | "select" | "checkbox";

type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: Array<{ label: string; value: string }>;
};

type ToolDef = {
  fields: FieldDef[];
  steps: string[];
  compute?: (values: Record<string, string | boolean>, lang: Lang) => string;
};

const uploadOnlyTools = new Set<ToolId>([
  "pdf-to-word",
  "word-to-pdf",
  "compress-pdf",
  "social-resizer",
  "meme-generator",
  "banner-thumbnail-creator",
]);

const messages = {
  pt: {
    result: "Resultado instantâneo",
    clear: "Limpar",
    copy: "Copiar",
    share: "Compartilhar",
    download: "Baixar resultado",
    uploadTitle: "Enviar arquivo",
    uploadHint: "Selecione o documento/imagem para processar.",
    howTo: "Passo a passo",
    bmiTable: "Veja a interpretação do IMC",
    empty: "Preencha os campos para ver o resultado.",
  },
  en: {
    result: "Instant result",
    clear: "Clear",
    copy: "Copy",
    share: "Share",
    download: "Download result",
    uploadTitle: "Upload file",
    uploadHint: "Select document/image to process.",
    howTo: "Step by step",
    bmiTable: "BMI interpretation",
    empty: "Fill the fields to see the result.",
  },
  es: {
    result: "Resultado instantáneo",
    clear: "Limpiar",
    copy: "Copiar",
    share: "Compartir",
    download: "Descargar resultado",
    uploadTitle: "Subir archivo",
    uploadHint: "Selecciona documento/imagen para procesar.",
    howTo: "Paso a paso",
    bmiTable: "Interpretación del IMC",
    empty: "Completa los campos para ver el resultado.",
  },
};

const toNumber = (v: string | boolean) => Number(String(v || "").replace(",", "."));

const toolDefs: Partial<Record<ToolId, Record<Lang, ToolDef>>> = {
  "bmi-calculator": {
    pt: {
      fields: [
        { key: "height", label: "Altura", placeholder: "Ex.: 1,70 (m)", type: "number" },
        { key: "weight", label: "Peso", placeholder: "Ex.: 69,2 (kg)", type: "number" },
        { key: "age", label: "Idade (opcional)", placeholder: "Ex.: 30", type: "number" },
        { key: "sex", label: "Sexo (opcional)", type: "select", options: [{ label: "Feminino", value: "f" }, { label: "Masculino", value: "m" }] },
      ],
      steps: ["Informe altura e peso.", "Veja IMC e classificação instantânea.", "Use a tabela de referência abaixo.", "Ajuste hábitos com base no resultado."],
      compute: (values) => {
        const h = toNumber(values.height);
        const w = toNumber(values.weight);
        if (!h || !w) return messages.pt.empty;
        const imc = w / (h * h);
        const cls = imc < 18.5 ? "Magreza" : imc < 25 ? "Normal" : imc < 30 ? "Sobrepeso" : imc < 40 ? "Obesidade" : "Obesidade grave";
        const calories = Math.round(w * 30);
        return `IMC: ${imc.toFixed(2)} | Classificação: ${cls} | Sugestão calórica básica: ~${calories} kcal/dia`;
      },
    },
    en: { fields: [], steps: [], compute: undefined },
    es: { fields: [], steps: [], compute: undefined },
  },
  "calorie-calculator": {
    pt: {
      fields: [
        { key: "sex", label: "Sexo", type: "select", options: [{ label: "Feminino", value: "f" }, { label: "Masculino", value: "m" }] },
        { key: "age", label: "Idade", type: "number", placeholder: "Ex.: 30" },
        { key: "weight", label: "Peso (kg)", type: "number", placeholder: "Ex.: 70" },
        { key: "height", label: "Altura (cm)", type: "number", placeholder: "Ex.: 170" },
        { key: "activity", label: "Atividade", type: "select", options: [{ label: "Sedentário", value: "1.2" }, { label: "Moderado", value: "1.55" }, { label: "Intenso", value: "1.725" }] },
        { key: "goal", label: "Objetivo", type: "select", options: [{ label: "Manter", value: "0" }, { label: "Perder", value: "-400" }, { label: "Ganhar", value: "300" }] },
      ],
      steps: ["Preencha sexo, idade, peso e altura.", "Escolha atividade e objetivo.", "Veja TMB e calorias recomendadas.", "Ajuste metas conforme evolução."],
      compute: (v) => {
        const age = toNumber(v.age); const weight = toNumber(v.weight); const height = toNumber(v.height);
        const sex = String(v.sex || "m");
        if (!age || !weight || !height) return messages.pt.empty;
        const bmr = sex === "f" ? 10 * weight + 6.25 * height - 5 * age - 161 : 10 * weight + 6.25 * height - 5 * age + 5;
        const daily = bmr * Number(v.activity || 1.2) + Number(v.goal || 0);
        return `TMB: ${Math.round(bmr)} kcal | Recomendação diária: ${Math.round(daily)} kcal`;
      },
    },
  },
  "mortgage-calculator": {
    pt: {
      fields: [
        { key: "property", label: "Valor do imóvel", type: "number" },
        { key: "entry", label: "Entrada", type: "number" },
        { key: "rate", label: "Juros anual (%)", type: "number" },
        { key: "years", label: "Prazo (anos)", type: "number" },
        { key: "system", label: "Sistema", type: "select", options: [{ label: "Price", value: "price" }, { label: "SAC", value: "sac" }] },
      ],
      steps: ["Informe imóvel, entrada, juros e prazo.", "Escolha Price ou SAC.", "Veja parcela estimada.", "Use para comparar cenários."],
      compute: (v) => {
        const principal = toNumber(v.property) - toNumber(v.entry);
        const r = toNumber(v.rate) / 100 / 12;
        const n = toNumber(v.years) * 12;
        if (!principal || !r || !n) return messages.pt.empty;
        if (v.system === "sac") {
          const amort = principal / n;
          const first = amort + principal * r;
          return `SAC | 1ª parcela: ${first.toFixed(2)} | Amortização: ${amort.toFixed(2)}`;
        }
        const pmt = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
        return `Price | Parcela estimada: ${pmt.toFixed(2)} | Total meses: ${n}`;
      },
    },
  },
  "net-gross-salary": {
    pt: {
      fields: [
        { key: "gross", label: "Salário bruto", type: "number" },
        { key: "country", label: "País", type: "select", options: [{ label: "Brasil", value: "br" }, { label: "Portugal", value: "pt" }, { label: "EUA", value: "us" }] },
        { key: "dependents", label: "Dependentes", type: "number" },
      ],
      steps: ["Informe salário bruto e país.", "Adicione dependentes.", "Veja estimativa de descontos e salário líquido.", "Confira estimativas anual e 13º."],
      compute: (v) => {
        const gross = toNumber(v.gross);
        if (!gross) return messages.pt.empty;
        const dep = toNumber(v.dependents);
        const inss = gross * 0.11;
        const ir = Math.max(0, gross * 0.1 - dep * 80);
        const net = gross - inss - ir;
        return `INSS: ${inss.toFixed(2)} | IR: ${ir.toFixed(2)} | Líquido: ${net.toFixed(2)} | Anual: ${(net * 12).toFixed(2)} | 13º: ${net.toFixed(2)}`;
      },
    },
  },
  "discount-margin-markup": {
    pt: {
      fields: [
        { key: "original", label: "Preço original", type: "number" },
        { key: "discount", label: "Desconto (%)", type: "number" },
        { key: "cost", label: "Custo (margem/markup)", type: "number" },
        { key: "profit", label: "Lucro (%)", type: "number" },
      ],
      steps: ["Preencha preço e desconto.", "Opcional: custo e lucro para margem/markup.", "Veja os 3 resultados juntos."],
      compute: (v) => {
        const original = toNumber(v.original);
        if (!original) return messages.pt.empty;
        const discount = toNumber(v.discount);
        const finalPrice = original * (1 - discount / 100);
        const cost = toNumber(v.cost);
        const profit = toNumber(v.profit);
        const markup = cost ? cost * (1 + profit / 100) : 0;
        const margin = original ? ((original - cost) / original) * 100 : 0;
        return `Preço com desconto: ${finalPrice.toFixed(2)} | Markup: ${markup.toFixed(2)} | Margem: ${margin.toFixed(2)}%`;
      },
    },
  },
  "travel-time-calculator": {
    pt: {
      fields: [
        { key: "distance", label: "Distância (km)", type: "number" },
        { key: "speed", label: "Velocidade média (km/h)", type: "number" },
        { key: "stops", label: "Paradas (min)", type: "number" },
        { key: "consumption", label: "Consumo (km/l)", type: "number" },
        { key: "fuel", label: "Preço combustível", type: "number" },
      ],
      steps: ["Informe distância e velocidade.", "Adicione paradas e consumo para cálculo avançado.", "Veja tempo e custo estimados."],
      compute: (v) => {
        const d = toNumber(v.distance); const s = toNumber(v.speed);
        if (!d || !s) return messages.pt.empty;
        const stops = toNumber(v.stops) / 60;
        const hours = d / s + stops;
        const fuelCost = toNumber(v.consumption) && toNumber(v.fuel) ? (d / toNumber(v.consumption)) * toNumber(v.fuel) : 0;
        return `Tempo estimado: ${hours.toFixed(2)} h | Custo combustível: ${fuelCost.toFixed(2)}`;
      },
    },
  },
  "word-counter": {
    pt: {
      fields: [{ key: "text", label: "Texto", placeholder: "Cole seu texto aqui", type: "text" }],
      steps: ["Cole o texto.", "Veja contagem instantânea de palavras, caracteres e parágrafos."],
      compute: (v) => {
        const text = String(v.text || "");
        if (!text.trim()) return messages.pt.empty;
        const words = text.trim().split(/\s+/).length;
        const chars = text.length;
        const noSpace = text.replace(/\s/g, "").length;
        const paragraphs = text.split(/\n+/).filter(Boolean).length;
        return `Palavras: ${words} | Caracteres: ${chars} | Sem espaço: ${noSpace} | Parágrafos: ${paragraphs}`;
      },
    },
  },
  "text-case-converter": {
    pt: {
      fields: [
        { key: "text", label: "Texto", type: "text" },
        { key: "action", label: "Ação", type: "select", options: [{ label: "MAIÚSCULAS", value: "upper" }, { label: "minúsculas", value: "lower" }, { label: "Capitalizar", value: "capitalize" }, { label: "Alternado", value: "alternate" }, { label: "Inverter", value: "reverse" }] },
      ],
      steps: ["Digite o texto.", "Escolha a transformação.", "Copie o resultado."],
      compute: (v) => {
        const text = String(v.text || "");
        const action = String(v.action || "upper");
        if (!text) return messages.pt.empty;
        if (action === "upper") return text.toUpperCase();
        if (action === "lower") return text.toLowerCase();
        if (action === "capitalize") return text.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
        if (action === "alternate") return text.split("").map((c, i) => (i % 2 ? c.toLowerCase() : c.toUpperCase())).join("");
        return text.split("").reverse().join("");
      },
    },
  },
};

const defaultDef: Record<Lang, ToolDef> = {
  pt: {
    fields: [
      { key: "a", label: "Valor 1", type: "number" },
      { key: "b", label: "Valor 2", type: "number" },
      { key: "text", label: "Texto/URL", type: "text" },
    ],
    steps: ["Preencha os campos da ferramenta.", "Veja o resultado instantâneo e copie se necessário."],
    compute: (v) => (String(v.text || "") || (toNumber(v.a) + toNumber(v.b)).toString() || messages.pt.empty),
  },
  en: { fields: [], steps: [], compute: undefined },
  es: { fields: [], steps: [], compute: undefined },
};

export default function PlaceholderTool({ toolId }: Props) {
  const { i18n } = useTranslation();
  const lang = ((i18n.language || "pt").split("-")[0] as Lang) || "pt";
  const m = messages[lang];
  const isUploadOnly = toolId ? uploadOnlyTools.has(toolId) : false;
  const def = (toolId && toolDefs[toolId]?.pt) || defaultDef.pt;

  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [showUpload, setShowUpload] = useState(false);

  const result = useMemo(() => {
    if (isUploadOnly) return "";
    return def.compute ? def.compute(values, lang) : m.empty;
  }, [def, values, lang, isUploadOnly, m.empty]);

  const clearAll = () => setValues({});

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  const shareResult = async () => {
    if (!result) return;
    if (navigator.share) {
      await navigator.share({ text: result });
    } else {
      await navigator.clipboard.writeText(result);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultado-toolss.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const bmiValue = result.includes("IMC:") ? Number(result.split("IMC:")[1]?.split("|")[0]) : NaN;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {isUploadOnly ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-800">{m.uploadTitle}</p>
          <p className="mt-1 text-sm text-gray-600">{m.uploadHint}</p>
          <input type="file" className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-2" />
          {def.fields.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {def.fields.map((f) => (
                <Field key={f.key} field={f} value={values[f.key]} onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {def.fields.map((f) => (
              <Field key={f.key} field={f} value={values[f.key]} onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={clearAll} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">{m.clear}</button>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
            <p className="font-semibold">{m.result}</p>
            <p className="mt-1 break-words">{result}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copyResult} className="rounded-lg border border-emerald-300 px-3 py-1 text-sm">{m.copy}</button>
              <button type="button" onClick={shareResult} className="rounded-lg border border-emerald-300 px-3 py-1 text-sm">{m.share}</button>
              <button type="button" onClick={downloadResult} className="rounded-lg border border-emerald-300 px-3 py-1 text-sm">{m.download}</button>
            </div>
          </div>
        </>
      )}

      {toolId === "bmi-calculator" && !Number.isNaN(bmiValue) && (
        <div className="overflow-hidden rounded-xl border border-blue-200">
          <div className="bg-blue-700 px-4 py-3 text-sm font-semibold text-white">{m.bmiTable}</div>
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50 text-blue-800"><tr><th className="px-4 py-2">IMC</th><th className="px-4 py-2">Classificação</th></tr></thead>
            <tbody className="bg-white text-gray-700">
              <tr><td className="px-4 py-2">&lt; 18,5</td><td className="px-4 py-2">Magreza</td></tr>
              <tr><td className="px-4 py-2">18,5 - 24,9</td><td className="px-4 py-2">Normal</td></tr>
              <tr><td className="px-4 py-2">25,0 - 29,9</td><td className="px-4 py-2">Sobrepeso</td></tr>
              <tr><td className="px-4 py-2">30,0 - 39,9</td><td className="px-4 py-2">Obesidade</td></tr>
              <tr><td className="px-4 py-2">≥ 40,0</td><td className="px-4 py-2">Obesidade grave</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900">{m.howTo}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          {def.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      {!isUploadOnly && (
        <div className="rounded-xl border border-gray-200 p-4">
          <button onClick={() => setShowUpload((s) => !s)} className="text-sm font-medium text-emerald-700 underline" type="button">
            {m.optionalUpload}
          </button>
          {showUpload && <input type="file" className="mt-3 w-full" />}
        </div>
      )}
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: string | boolean | undefined; onChange: (v: string | boolean) => void }) {
  if (field.type === "select") {
    return (
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-gray-700">{field.label}</span>
        <select className="w-full rounded-xl border border-gray-300 px-4 py-3" value={String(value || "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-sm font-semibold text-gray-700">{field.label}</span>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{field.label}</span>
      <input
        type={field.type}
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
    </label>
  );
}
