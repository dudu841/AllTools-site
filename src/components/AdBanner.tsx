import React from "react";
import { useTranslation } from "react-i18next";

interface AdBannerProps {
  className?: string;
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle";
}

export default function AdBanner({
  className = "",
  slotId = "1234567890",
  format = "auto",
}: AdBannerProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`w-full flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-4 my-8 min-h-[100px] text-gray-400 text-sm ${className}`}
    >
      <div className="text-center">
        <p>{t("common.adSpace")}</p>
        <p className="text-xs opacity-50">{t("common.slot")}: {slotId}</p>
      </div>
      {/* 
        Actual AdSense code would go here:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
    </div>
  );
}
