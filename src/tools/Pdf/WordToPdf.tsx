import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, FileText } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function sanitizeForPdfLib(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractWordText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (extension === "txt") {
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }

  if (extension === "docx") {
    const zipLike = new TextDecoder("latin1").decode(bytes);
    const xmlStart = zipLike.indexOf("<w:document");
    const xmlEnd = zipLike.lastIndexOf("</w:document>");

    if (xmlStart >= 0 && xmlEnd > xmlStart) {
      const xml = zipLike.slice(xmlStart, xmlEnd + "</w:document>".length);
      const noTags = xml
        .replace(/<w:p[^>]*>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
      return noTags;
    }

    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }

  return new TextDecoder("latin1").decode(bytes);
}

async function createPdfFromText(rawText: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const body = sanitizeForPdfLib(rawText) || "Documento sem texto detectável.";

  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 40;
  const marginY = 40;
  const maxWidth = pageWidth - marginX * 2;
  const fontSize = 11;
  const lineHeight = 16;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - marginY;

  const pushLine = (line: string) => {
    if (y < marginY) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - marginY;
    }

    page.drawText(line, {
      x: marginX,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });

    y -= lineHeight;
  };

  const paragraphs = body.split(/\r?\n/);

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ").filter(Boolean);

    if (words.length === 0) {
      y -= lineHeight;
      continue;
    }

    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(candidate, fontSize);

      if (width > maxWidth && line) {
        pushLine(line);
        line = word;
      } else {
        line = candidate;
      }
    }

    if (line) {
      pushLine(line);
    }

    y -= 4;
  }

  return pdf.save();
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

  const labels = useMemo(
    () => ({
      invalidType:
        lang === "pt"
          ? "Envie um arquivo .docx, .doc ou .txt"
          : lang === "es"
            ? "Sube un archivo .docx, .doc o .txt"
            : "Upload a .docx, .doc or .txt file",
      convertError:
        lang === "pt"
          ? "Erro ao converter Word para PDF."
          : lang === "es"
            ? "Error al convertir Word a PDF."
            : "Error converting Word to PDF.",
      emptyDocument:
        lang === "pt"
          ? "O arquivo não possui conteúdo legível para converter."
          : lang === "es"
            ? "El archivo no tiene contenido legible para convertir."
            : "The file has no readable content to convert.",
    }),
    [lang],
  );

  const onFile = (selected?: File | null) => {
    if (!selected) return;
    if (!/\.(docx|doc|txt)$/i.test(selected.name)) {
      setError(labels.invalidType);
      return;
    }

    setFile(selected);
    setDownloadUrl(null);
    setError("");
    setOutputName(`${selected.name.replace(/\.(docx|doc|txt)$/i, "")}.pdf`);
  };

  const clearAll = () => {
    setFile(null);
    setError("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
  };

  const onConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError("");

    try {
      const text = await extractWordText(file);
      if (!text.trim()) {
        setError(labels.emptyDocument);
        setIsProcessing(false);
        return;
      }

      const bytes = await createPdfFromText(text);

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      setDownloadUrl(URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })));
    } catch {
      setError(labels.convertError);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center hover:bg-gray-50"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".docx,.doc,.txt"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Upload className="mx-auto h-10 w-10 text-emerald-600" />
          <p className="mt-3 text-lg font-semibold text-gray-900">{t("common.upload")}</p>
          <p className="text-sm text-gray-500">DOCX / DOC / TXT</p>
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
          <button
            type="button"
            onClick={onConvert}
            disabled={isProcessing}
            className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isProcessing ? t("common.processing") : t("common.convert")}
          </button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={outputName}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              {t("common.download")}
            </a>
          )}
        </div>
      )}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
