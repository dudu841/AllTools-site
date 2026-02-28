import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function MergePdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const pdfFiles = selected.filter((f: File) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfFiles.length > 0) {
      setFiles((prev) => [...prev, ...pdfFiles]);
      setMergedPdfUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the PDFs.");
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          multiple
          className="hidden"
        />
        <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("common.upload")}
        </h3>
        <p className="text-gray-500">{t("tools.merge-pdf.instruction")}</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {t("tools.merge-pdf.selected")} ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                >
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
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-4">
          <h3 className="text-lg font-medium text-emerald-800">
            {t("tools.merge-pdf.success")}
          </h3>
          <a
            href={mergedPdfUrl}
            download="merged_document.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t("common.download")}
          </a>
        </div>
      )}
    </div>
  );
}
