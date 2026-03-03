import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText, CheckCircle2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

function decodeEscapedPdfString(value: string): string {
  return value
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/\\b/g, "")
    .replace(/\\f/g, "")
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

function extractTextBlocks(pdfSource: string): string[] {
  const btBlocks = Array.from(pdfSource.matchAll(/BT([\s\S]*?)ET/gm));
  const lines: string[] = [];

  for (const block of btBlocks) {
    const content = block[1];
    let current = "";

    const tokens = Array.from(
      content.matchAll(/\[(?:\\.|[^\]])*\]\s*TJ|\((?:\\.|[^\)])*\)\s*Tj|T\*|Td|TD/gm),
    );

    for (const token of tokens) {
      const raw = token[0];

      if (raw === "T*" || raw === "Td" || raw === "TD") {
        if (current.trim()) lines.push(current.trim());
        current = "";
        continue;
      }

      if (raw.endsWith("Tj")) {
        const m = raw.match(/\((.*)\)\s*Tj$/s);
        if (m) current += decodeEscapedPdfString(m[1]);
        continue;
      }

      if (raw.endsWith("TJ")) {
        const arr = raw.match(/^\[(.*)\]\s*TJ$/s)?.[1] || "";
        const parts = Array.from(arr.matchAll(/\((.*?)\)|-?\d+(?:\.\d+)?/g));
        for (const part of parts) {
          if (part[1] !== undefined) {
            current += decodeEscapedPdfString(part[1]);
          } else {
            const kern = Number(part[0]);
            if (Number.isFinite(kern) && kern < -120) current += " ";
          }
        }
      }
    }

    if (current.trim()) lines.push(current.trim());
  }

  return lines;
}

async function extractPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const decoded = new TextDecoder("latin1").decode(bytes);
  const lines = extractTextBlocks(decoded);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
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

  const labels = useMemo(
    () => ({
      invalid:
        lang === "pt"
          ? "Envie um arquivo PDF válido."
          : lang === "es"
            ? "Sube un PDF válido."
            : "Upload a valid PDF file.",
      failed:
        lang === "pt"
          ? "Erro ao converter PDF para Word."
          : lang === "es"
            ? "Error al convertir PDF a Word."
            : "Error converting PDF to Word.",
      empty:
        lang === "pt"
          ? "Este PDF parece conter texto vetorial/imagem e não pôde ser convertido com fidelidade no navegador."
          : lang === "es"
            ? "Este PDF parece contener texto vectorial/imagen y no pudo convertirse con fidelidad en el navegador."
            : "This PDF appears image/vector-based and could not be faithfully converted in-browser.",
      done:
        lang === "pt" ? "Conversão concluída." : lang === "es" ? "Conversión finalizada." : "Conversion completed.",
    }),
    [lang],
  );

  const onFile = async (selected?: File | null) => {
    if (!selected) return;
    if (!(selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf"))) {
      setError(labels.invalid);
      return;
    }

    try {
      await PDFDocument.load(await selected.arrayBuffer(), { ignoreEncryption: true });
    } catch {
      setError(labels.invalid);
      return;
    }

    setFile(selected);
    setError("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setOutputName(`${selected.name.replace(/\.pdf$/i, "")}.doc`);
  };

  const clearAll = () => {
    setFile(null);
    setError("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  const onConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const text = await extractPdfText(file);
      const body = text || labels.empty;
      const html = buildWordHtml(file.name, body);
      const blob = new Blob([html], { type: "application/msword" });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setError(labels.failed);
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
            <button type="button" onClick={clearAll} className="text-sm text-red-600">{t("common.clear")}</button>
          </div>

          {!downloadUrl && (
            <button type="button" onClick={onConvert} disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              {isProcessing ? t("common.processing") : t("common.convert")}
            </button>
          )}

          {downloadUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-emerald-800 font-semibold"><CheckCircle2 className="h-5 w-5" />{labels.done}</p>
              <a href={downloadUrl} download={outputName} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C853] px-4 py-3 font-semibold text-white"><Download className="h-4 w-4" />{t("common.download")}</a>
            </div>
          )}
        </div>
      )}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
