import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText, X, CheckCircle2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function MergePdf() {
  const { t, i18n } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = (i18n.language || "pt").slice(0, 2);
  const labels = useMemo(
    () => ({
      failed:
        lang === "pt"
          ? "Não foi possível unir os PDFs selecionados."
          : lang === "es"
            ? "No fue posible unir los PDFs seleccionados."
            : "Could not merge selected PDFs.",
    }),
    [lang],
  );

  const clearOutput = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setMergedPdfUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const pdfFiles = selected.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfFiles.length > 0) {
      setFiles((prev) => [...prev, ...pdfFiles]);
      clearOutput();
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    clearOutput();
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: false, addDefaultPage: false });
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      clearOutput();
      setMergedPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError(labels.failed);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" multiple className="hidden" />
        <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("common.upload")}</h3>
        <p className="text-gray-500">{t("tools.merge-pdf.instruction")}</p>
      </div>

      {files.length > 0 && !mergedPdfUrl && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {t("tools.merge-pdf.selected")} ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={mergePdfs}
            disabled={files.length < 2 || isMerging}
            className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isMerging ? t("common.processing") : t("tools.merge-pdf.title")}
          </button>
        </div>
      )}

      {mergedPdfUrl && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 space-y-4 text-center">
          <p className="flex items-center justify-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="h-5 w-5" /> {t("tools.merge-pdf.success")}
          </p>
          <a
            href={mergedPdfUrl}
            download="merged-document.pdf"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#00C853] text-white font-medium rounded-xl"
          >
            <Download className="w-5 h-5" />
            {t("common.download")}
          </a>
        </div>
      )}

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
