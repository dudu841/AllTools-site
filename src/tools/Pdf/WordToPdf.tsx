import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function extractBasicWordText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const cleaned = raw.replace(/[\x00-\x1F]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned;
}

export default function WordToPdf() {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("converted.pdf");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = (i18n.language || "pt").slice(0, 2);

  const onFile = (selected?: File | null) => {
    if (!selected) return;
    if (!/\.(docx|doc|txt)$/i.test(selected.name)) {
      setError(lang === "pt" ? "Envie um arquivo .docx, .doc ou .txt" : lang === "es" ? "Sube un archivo .docx, .doc o .txt" : "Upload a .docx, .doc or .txt file");
      return;
    }

    setFile(selected);
    setDownloadUrl(null);
    setError("");
    setOutputName(`${selected.name.replace(/\.(docx|doc|txt)$/i, "")}.pdf`);
  };

  const onConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");

    try {
      const text = await extractBasicWordText(file);
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([595, 842]);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const body = text || (lang === "pt" ? "Documento sem texto detectável." : lang === "es" ? "Documento sin texto detectable." : "Document without detectable text.");

      const maxWidth = 515;
      let y = 800;
      const fontSize = 11;
      const words = body.split(" ");
      let line = "";

      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        const width = font.widthOfTextAtSize(test, fontSize);
        if (width > maxWidth) {
          page.drawText(line, { x: 40, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= 16;
          line = word;
          if (y < 40) break;
        } else {
          line = test;
        }
      }
      if (line && y >= 40) {
        page.drawText(line, { x: 40, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      }

      const bytes = await pdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })));
    } catch {
      setError(lang === "pt" ? "Erro ao converter Word para PDF." : lang === "es" ? "Error al convertir Word a PDF." : "Error converting Word to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!file ? (
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center hover:bg-gray-50">
          <input ref={inputRef} type="file" accept=".docx,.doc,.txt" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <Upload className="mx-auto h-10 w-10 text-emerald-600" />
          <p className="mt-3 text-lg font-semibold text-gray-900">{t("common.upload")}</p>
          <p className="text-sm text-gray-500">DOCX / DOC / TXT</p>
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
