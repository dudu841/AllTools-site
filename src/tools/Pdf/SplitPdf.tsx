import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText, CheckCircle2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SplitPdf() {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = (i18n.language || "pt").slice(0, 2);
  const labels = useMemo(
    () => ({
      invalidRange:
        lang === "pt"
          ? "Intervalo de páginas inválido."
          : lang === "es"
            ? "Intervalo de páginas inválido."
            : "Invalid page range.",
      loadErr:
        lang === "pt" ? "Não foi possível abrir este PDF." : lang === "es" ? "No se pudo abrir este PDF." : "Could not open this PDF.",
      splitErr:
        lang === "pt"
          ? "Não foi possível dividir o PDF."
          : lang === "es"
            ? "No se pudo dividir el PDF."
            : "Could not split this PDF.",
    }),
    [lang],
  );

  const clearOutput = () => {
    if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    setSplitPdfUrl(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || !(selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf"))) return;

    setFile(selected);
    clearOutput();
    setError("");

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPageCount(count);
      setStartPage(1);
      setEndPage(count);
    } catch {
      setError(labels.loadErr);
      setFile(null);
      setPageCount(0);
    }
  };

  const splitPdf = async () => {
    if (!file || startPage > endPage || startPage < 1 || endPage > pageCount) {
      setError(labels.invalidRange);
      return;
    }

    setIsSplitting(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i);
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const splitPdfBytes = await newPdf.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([splitPdfBytes], { type: "application/pdf" });
      clearOutput();
      setSplitPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError(labels.splitErr);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
          <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("common.upload")}</h3>
          <p className="text-gray-500">{t("tools.split-pdf.instruction")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-500">{pageCount} {t("tools.split-pdf.pages")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                clearOutput();
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t("common.clear")}
            </button>
          </div>

          {!splitPdfUrl && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <h4 className="font-medium text-gray-900">{t("tools.split-pdf.select-range")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.split-pdf.from-page")}</label>
                  <input
                    type="number"
                    min="1"
                    max={endPage}
                    value={startPage}
                    onChange={(e) => setStartPage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("tools.split-pdf.to-page")}</label>
                  <input
                    type="number"
                    min={startPage}
                    max={pageCount}
                    value={endPage}
                    onChange={(e) => setEndPage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={splitPdf}
                disabled={isSplitting}
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isSplitting ? t("common.processing") : t("tools.split-pdf.title")}
              </button>
            </div>
          )}

          {splitPdfUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
              <p className="flex items-center justify-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="h-5 w-5" /> {t("tools.split-pdf.success")}
              </p>
              <p className="text-sm text-emerald-700">{t("tools.split-pdf.extracted", { start: startPage, end: endPage })}</p>
              <a
                href={splitPdfUrl}
                download={`split_${startPage}-${endPage}_${file.name}`}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#00C853] text-white font-medium rounded-xl"
              >
                <Download className="w-5 h-5" />
                {t("common.download")}
              </a>
            </div>
          )}
        </div>
      )}

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
