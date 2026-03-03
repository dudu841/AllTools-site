import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText } from "lucide-react";

async function extractBasicPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const decoded = new TextDecoder("latin1").decode(bytes);
  const matches = [...decoded.matchAll(/\(([^\)]{2,})\)/g)].map((m) => m[1]);
  const joined = matches.join(" ").replace(/\s+/g, " ").trim();
  return joined;
}

function buildWordHtml(title: string, body: string): string {
  const safeTitle = title.replace(/[<>]/g, "");
  const safeBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /><title>${safeTitle}</title></head><body><h1>${safeTitle}</h1><p>${safeBody}</p></body></html>`;
}

export default function PdfToWord() {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("converted.doc");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = (i18n.language || "pt").slice(0, 2);

  const onFile = (selected?: File | null) => {
    if (!selected) return;
    if (!(selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf"))) {
      setError(lang === "pt" ? "Envie um arquivo PDF válido." : lang === "es" ? "Sube un PDF válido." : "Upload a valid PDF file.");
      return;
    }

    setFile(selected);
    setError("");
    setDownloadUrl(null);
    setOutputName(`${selected.name.replace(/\.pdf$/i, "")}.doc`);
  };

  const onConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const text = await extractBasicPdfText(file);
      const body = text || (lang === "pt" ? "Texto do PDF não pôde ser extraído com fidelidade total no navegador." : lang === "es" ? "El texto del PDF no pudo extraerse con fidelidad total en el navegador." : "PDF text could not be fully extracted with fidelity in-browser.");
      const html = buildWordHtml(file.name, body);
      const blob = new Blob([html], { type: "application/msword" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError(lang === "pt" ? "Erro ao converter PDF para Word." : lang === "es" ? "Error al convertir PDF a Word." : "Error converting PDF to Word.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!file ? (
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center hover:bg-gray-50">
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <Upload className="mx-auto h-10 w-10 text-emerald-600" />
          <p className="mt-3 text-lg font-semibold text-gray-900">{t("common.upload")}</p>
          <p className="text-sm text-gray-500">PDF</p>
        </button>
      ) : (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 border border-gray-200">
            <div className="flex items-center gap-2 min-w-0"><FileText className="h-5 w-5 text-emerald-600" /><span className="truncate text-sm text-gray-700">{file.name}</span></div>
            <button type="button" onClick={() => { setFile(null); setDownloadUrl(null); setError(""); }} className="text-sm text-red-600">{t("common.clear")}</button>
          </div>
          <button type="button" onClick={onConvert} disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{isProcessing ? t("common.processing") : t("common.convert")}</button>
          {downloadUrl && <a href={downloadUrl} download={outputName} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"><Download className="h-4 w-4" />{t("common.download")}</a>}
        </div>
      )}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
