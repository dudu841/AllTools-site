import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, File as FileIcon } from "lucide-react";

export default function PlaceholderTool() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {!file ? (
        <div 
          className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("common.upload")}
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {t(
              "common.inDevelopment",
              "This tool is currently in development. Please check back later for updates.",
            )}
          </p>
          <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors pointer-events-none">
            {t("common.upload")}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-gray-50 rounded-2xl border border-gray-200">
          <FileIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <p className="font-medium text-gray-900 truncate mb-2">{file.name}</p>
          <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm mb-6 border border-amber-200">
            {t(
              "common.inDevelopment",
              "This tool is currently in development. Please check back later for updates.",
            )}
          </div>
          <button
            onClick={() => setFile(null)}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
          >
            {t("common.clear", "Clear")}
          </button>
        </div>
      )}
    </div>
  );
}
