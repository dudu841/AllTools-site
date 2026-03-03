import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText, CheckCircle2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function CompressPdf() {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("compressed.pdf");
  const [ratio, setRatio] = useState<string>("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = (i18n.language || "pt").slice(0, 2);

  const labels = useMemo(
    () => ({
      invalid:
        lang === "pt"
          ? "Envie um PDF válido."
          : lang === "es"
            ? "Sube un PDF válido."
            : "Upload a valid PDF.",
      failed:
        lang === "pt"
          ? "Não foi possível comprimir este PDF."
          : lang === "es"
            ? "No se pudo comprimir este PDF."
            : "Could not compress this PDF.",
      done:
        lang === "pt"
          ? "PDF comprimido com sucesso."
          : lang === "es"
            ? "PDF comprimido con éxito."
            : "PDF compressed successfully.",
      reduced:
        lang === "pt"
          ? "Redução de tamanho"
          : lang === "es"
            ? "Reducción de tamaño"
            : "Size reduction",
    }),
    [lang],
  );

  const onFile = (selected?: File | null) => {
    if (!selected) return;
    if (!(selected.type === "application/pdf" || selected.name.toLowerCase().endsWith(".pdf"))) {
      setError(labels.invalid);
      return;
    }

    setFile(selected);
    setError("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setRatio("");
    setOutputName(`${selected.name.replace(/\.pdf$/i, "")}-compressed.pdf`);
  };

  const onCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError("");

    try {
      const sourceBytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });

      const compressedBytes = await doc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 100,
        updateFieldAppearances: false,
      });

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));

      const reduction = Math.max(0, Math.round((1 - compressedBytes.length / sourceBytes.length) * 100));
      setRatio(`${labels.reduced}: ${reduction}%`);
    } catch {
      setError(labels.failed);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setError("");
    setRatio("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center hover:bg-gray-50"
        >
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <Upload className="mx-auto h-10 w-10 text-emerald-600" />
          <p className="mt-3 text-lg font-semibold text-gray-900">{t("common.upload")}</p>
          <p className="text-sm text-gray-500">PDF</p>
        </button>
      ) : (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 border border-gray-200">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span className="truncate text-sm text-gray-700">{file.name}</span>
            </div>
            <button type="button" onClick={clearAll} className="text-sm text-red-600">
              {t("common.clear")}
            </button>
          </div>

          {!downloadUrl && (
            <button
              type="button"
              onClick={onCompress}
              disabled={isProcessing}
              className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isProcessing ? t("common.processing") : t("common.compress")}
            </button>
          )}

          {downloadUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="h-5 w-5" /> {labels.done}
              </p>
              {ratio && <p className="mt-1 text-sm text-emerald-700">{ratio}</p>}
              <a
                href={downloadUrl}
                download={outputName}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C853] px-4 py-3 font-semibold text-white"
              >
                <Download className="h-4 w-4" />
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
