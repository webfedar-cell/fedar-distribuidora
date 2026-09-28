"use client";

import React, { useState } from "react";
import { COMPANY_DATA } from "@/data/products";

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip opcional al hacer hover */}
      {showTooltip && (
        <div className="hidden sm:block bg-[#0A1F36] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xl border border-[#254A73] animate-in fade-in slide-in-from-right-2">
          ¿En qué podemos ayudarte? ¡Escribinos!
        </div>
      )}

      <a
        href={COMPANY_DATA.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp a FEDAR Distribuidora"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-hidden"
      >
        {/* Logo Oficial de WhatsApp */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-105"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.12c-.24.68-1.2 1.27-1.95 1.36-.51.06-1.18.1-3.43-.84-2.87-1.2-4.73-4.13-4.87-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.19-.15.31-.29.48-.15.17-.31.38-.45.51-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.19-.21.79-.92 1-1.24.21-.31.42-.26.71-.15.29.1 1.84.87 2.16 1.02.31.16.53.24.61.37.07.13.07.78-.17 1.46z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E0A93B] border-2 border-white rounded-full animate-pulse" />
      </a>
    </div>
  );
};
