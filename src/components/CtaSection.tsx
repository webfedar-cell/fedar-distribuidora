"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Download, PhoneCall, ShieldCheck } from "lucide-react";
import { COMPANY_DATA } from "@/data/products";
import { useModals } from "@/context/ModalContext";

interface CtaSectionProps {
  onOpenPriceListModal?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenPriceListModal }) => {
  const modals = useModals();
  const handleOpenPriceList = onOpenPriceListModal || modals.openPriceListModal;

  return (
    <section className="py-12 sm:py-16 lg:py-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 w-full">
      <div className="bg-[#0A1F36] rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#1E3B5C] relative overflow-hidden shadow-2xl">
        {/* Glow ambiental */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E0A93B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#12355B]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Lado izquierdo: Textos */}
          <div className="flex flex-col gap-4 max-w-[680px] text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184677] border border-[#3B6490] text-[#E0A93B] text-xs font-semibold uppercase tracking-wider w-fit mx-auto lg:mx-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Venta Exclusiva Mayorista</span>
            </div>

            <h2 className="font-heading font-extrabold text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.05] text-white uppercase tracking-tight">
              ¿Tenés ferretería, bulonera o repuestera?
            </h2>

            <p className="text-[16px] sm:text-[18px] text-[#C9D6E3] leading-[1.55]">
              Pedí la lista de precios actualizada, solicitá cotización para tu comercio o coordiná la visita de un corredor para armar tu gavetero.
            </p>

            <div className="text-xs sm:text-sm text-[#8497AC] flex items-center justify-center lg:justify-start gap-4 pt-1">
              <a href={`tel:${COMPANY_DATA.phoneRaw}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <PhoneCall className="w-3.5 h-3.5 text-[#E0A93B]" />
                Atención telefónica directa: {COMPANY_DATA.phone}
              </a>
            </div>
          </div>

          {/* Lado derecho: Botones */}
          <div className="flex flex-col gap-3.5 w-full sm:w-[320px] shrink-0">
            <a
              href={COMPANY_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-6 rounded-xl bg-[#E0A93B] hover:bg-[#F2B94C] text-[#0F1B2D] font-bold text-[16px] sm:text-[17px] flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-[#E0A93B]/20 cursor-pointer transform active:scale-98"
            >
              <MessageSquare className="w-5 h-5 text-[#0F1B2D]" />
              <span>Escribinos por WhatsApp</span>
            </a>

            <Link
              href="/lista-de-precios"
              className="h-14 px-6 rounded-xl border-1.5 border-[#6F8BAA] hover:border-white hover:bg-white/10 text-white font-semibold text-[16px] sm:text-[17px] flex items-center justify-center gap-2.5 transition-all backdrop-blur-xs cursor-pointer"
            >
              <Download className="w-5 h-5 text-[#E0A93B]" />
              <span>Ver lista de precios</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
