"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Download, CheckCircle2, Sparkles, Layers, ArrowRight } from "lucide-react";
import { COMPANY_DATA } from "@/data/products";
import { useModals } from "@/context/ModalContext";

interface HeroSectionProps {
  onOpenPriceListModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPriceListModal }) => {
  const modals = useModals();
  const handleOpenPriceList = onOpenPriceListModal || modals.openPriceListModal;

  return (
    <section
      id="inicio"
      className="relative hero-grid-pattern text-white overflow-hidden py-12 sm:py-16 lg:py-20 min-h-[580px] flex items-center border-b border-[#0A1F36]"
    >
      {/* Glow ambiental de fondo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#2A5C91]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#E0A93B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna Texto */}
          <div className="lg:col-span-7 flex flex-col gap-6 max-w-[660px]">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#184677]/80 border border-[#4873A2]/50 text-[#E0A93B] text-xs sm:text-sm font-semibold tracking-wider uppercase w-fit shadow-xs backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-[#E0A93B]" />
              <span>Distribuidora Mayorista Oficial</span>
            </div>

            {/* Titular */}
            <h1 className="font-heading font-extrabold text-[38px] sm:text-[54px] lg:text-[62px] leading-[1.02] text-white tracking-tight uppercase">
              Accesorios, terminales y repuestos para tu mostrador.
            </h1>

            {/* Descripción */}
            <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.55] text-[#C9D6E3] font-normal">
              Gaveteros armados con stock de alta rotación, reposición periódica por corredor y envíos a todo el país.
              Simplificá las compras de tu ferretería, bulonera o repuestera.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/lista-de-precios"
                className="h-14 px-7 rounded-lg bg-[#E0A93B] hover:bg-[#F2B94C] text-[#0F1B2D] font-bold text-[16px] sm:text-[17px] flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-[#E0A93B]/20 cursor-pointer transform active:scale-98"
              >
                <Download className="w-5 h-5 text-[#0F1B2D]" />
                <span>Ver lista de precios</span>
              </Link>

              <Link
                href="/productos"
                className="h-14 px-6 rounded-lg border-1.5 border-[#6F8BAA] hover:border-white hover:bg-white/10 text-white font-semibold text-[16px] sm:text-[17px] flex items-center justify-center gap-2.5 transition-all backdrop-blur-xs"
              >
                <span>Explorar productos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Puntos destacados mini */}
            <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#A5BCD4]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E0A93B]" />
                <span>Stock inmediato garantizado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E0A93B]" />
                <span>Visita de corredor en tu zona</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E0A93B]" />
                <span>Factura A y B</span>
              </div>
            </div>
          </div>

          {/* Columna Ilustración / Gavetero */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px]">
              {/* Badge flotante Gavetero */}
              <div className="absolute -top-4 -left-2 sm:-left-6 z-20 bg-[#0A1F36]/90 border border-[#4873A2] rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E0A93B]/20 border border-[#E0A93B]/40 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#E0A93B]" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#A5BCD4] font-semibold">Sistema Mostrador</div>
                  <div className="text-sm font-bold text-white">Gavetero Listo Para Vender</div>
                </div>
              </div>

              {/* Imagen principal del gavetero */}
              <div className="relative rounded-2xl overflow-hidden p-3 bg-gradient-to-b from-white/10 to-transparent border border-white/15 backdrop-blur-xs shadow-2xl">
                <div className="relative aspect-4/3 w-full flex items-center justify-center bg-[#0d2a4a]/40 rounded-xl overflow-hidden">
                  <Image
                    src="/images/gavetero.png"
                    alt="Gavetero organizador de terminales y accesorios FEDAR"
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              {/* Badge flotante inferior */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 z-20 bg-[#12355B]/95 border border-[#6F8BAA] rounded-xl px-4 py-2 shadow-xl backdrop-blur-md flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
                <span className="text-xs font-semibold text-white">
                  +1.500 ferreterías y buloneras activas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
