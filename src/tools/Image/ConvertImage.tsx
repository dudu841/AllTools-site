import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download } from "lucide-react";

export default function ConvertImage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<
    "image/jpeg" | "image/png" | "image/webp"
  >("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selected.name))) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
      setConvertedImage(null);
    }
  };

  const convert = () => {
    if (!preview) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill white background for PNG to JPEG conversion
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(targetFormat, quality);
      setConvertedImage(dataUrl);
    };
    img.src = preview;
  };

  const getExtension = (mimeType: string) => {
    switch (mimeType) {
      case "image/jpeg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/webp":
        return "webp";
      default:
        return "jpg";
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("common.upload")}
          </h3>
          <p className="text-gray-500">{t("common.supported-images", "JPG, PNG, WebP up to 10MB")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={preview!}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  Format: {file.type.split("/")[1].toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setConvertedImage(null);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t("common.clear")}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("tools.convert-image.format")}
              </label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("tools.compress-image.level", "Quality")}
                  </label>
                  <span className="text-sm font-bold text-emerald-600">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            )}

            <button
              onClick={convert}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {t("tools.convert-image.title")}
            </button>
          </div>

          {convertedImage && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-4">
              <a
                href={convertedImage}
                download={`converted_${file.name.split(".")[0]}.${getExtension(targetFormat)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t("common.download")}{" "}
                {getExtension(targetFormat).toUpperCase()}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
