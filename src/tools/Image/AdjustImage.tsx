import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Download, Sliders } from "lucide-react";

export default function AdjustImage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [adjustedImage, setAdjustedImage] = useState<string | null>(null);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(selected.name))) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        resetAdjustments();
      };
      reader.readAsDataURL(selected);
    }
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setSepia(0);
    setInvert(0);
  };

  useEffect(() => {
    if (!preview || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hue}deg) sepia(${sepia}%) invert(${invert}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const type = file?.type || "image/jpeg";
      setAdjustedImage(canvas.toDataURL(type, 1.0));
    };
    img.src = preview;
  }, [preview, brightness, contrast, saturation, blur, hue, sepia, invert, file]);

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
                  alt="Original"
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
                setAdjustedImage(null);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t("common.clear")}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <h4 className="font-medium text-gray-900">{t("tools.adjust-image.title")}</h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.brightness")}</label>
                  <span className="text-sm text-gray-500">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.contrast")}</label>
                  <span className="text-sm text-gray-500">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.saturation")}</label>
                  <span className="text-sm text-gray-500">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.blur")}</label>
                  <span className="text-sm text-gray-500">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.hue", "Hue")}</label>
                  <span className="text-sm text-gray-500">{hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.sepia", "Sepia")}</label>
                  <span className="text-sm text-gray-500">{sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{t("tools.adjust-image.invert", "Invert")}</label>
                  <span className="text-sm text-gray-500">{invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => setInvert(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={resetAdjustments}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                {t("common.reset")}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-center overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm" />
          </div>

          {adjustedImage && (
            <div className="flex justify-center">
              <a
                href={adjustedImage}
                download={`adjusted_${file.name}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors w-full justify-center"
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
