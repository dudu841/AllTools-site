import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, Settings, Smartphone, Square, Monitor, Image as ImageIcon } from "lucide-react";

const PREDEFINED_SIZES = [
  { label: "1:1", desc: "Instagram Post", width: 1080, height: 1080, icon: Square },
  { label: "9:16", desc: "Story / Reels", width: 1080, height: 1920, icon: Smartphone },
  { label: "4:5", desc: "Portrait", width: 1080, height: 1350, icon: ImageIcon },
  { label: "16:9", desc: "Full HD", width: 1920, height: 1080, icon: Monitor },
];

export default function ResizeImage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [quality, setQuality] = useState(0.9);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("Custom");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selected.name))) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);

        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setOriginalRatio(img.width / img.height);
          setSelectedSize("Custom");
        };
        img.src = result;
      };
      reader.readAsDataURL(selected);
      setResizedImage(null);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    setSelectedSize("Custom");
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / originalRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    setSelectedSize("Custom");
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * originalRatio));
    }
  };

  const handlePredefinedSizeClick = (label: string, w: number, h: number) => {
    setSelectedSize(label);
    setWidth(w);
    setHeight(h);
    setMaintainAspectRatio(false);
  };

  const resize = () => {
    if (!preview) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      const type = file?.type || "image/jpeg";
      const dataUrl = canvas.toDataURL(type, quality);

      setResizedImage(dataUrl);
    };
    img.src = preview;
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
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setResizedImage(null);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t("common.clear")}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t("tools.resize-image.predefined-sizes")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PREDEFINED_SIZES.map((size) => {
                  const Icon = size.icon;
                  return (
                    <button
                      key={size.label}
                      onClick={() => handlePredefinedSizeClick(size.label, size.width, size.height)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        selectedSize === size.label
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 hover:border-emerald-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="font-bold text-sm">{size.label}</span>
                      <span className="text-xs opacity-70">{size.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tools.resize-image.width")}
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={handleWidthChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("tools.resize-image.height")}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={handleHeightChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                disabled={selectedSize !== "Custom"}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 disabled:opacity-50"
              />
              <span className={`text-gray-700 font-medium ${selectedSize !== "Custom" ? "opacity-50" : ""}`}>
                {t("tools.resize-image.maintain-ratio")}
              </span>
            </label>

            {(file?.type === "image/jpeg" || file?.type === "image/webp") && (
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mb-2"
                />
              </div>
            )}

            <button
              onClick={resize}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {t("tools.resize-image.title")}
            </button>
          </div>

          {resizedImage && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-4">
              <a
                href={resizedImage}
                download={`resized_${file.name}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t("common.download")}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
