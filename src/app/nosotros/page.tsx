"use client";

import React from "react";
import Link from "next/link";
import { AboutSection } from "@/components/AboutSection";
import { HowWeWorkSection } from "@/components/HowWeWorkSection";
import { CtaSection } from "@/components/CtaSection";
import { Users2, Sparkles, FileText, ArrowRight } from "lucide-react";
import { useCompanyConfig } from "@/context/CompanyContext";

export default function NosotrosPage() {
  const { config } = useCompanyConfig();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header de la Página */}
      <section className="bg-[#0A1F36] text-white py-12 sm:py-16 border-b border-[#142C4B]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5BCD4]">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-[#E0A93B] font-semibold">Nosotros</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184677] border border-[#3B6490] text-[#E0A93B] text-xs font-semibold uppercase tracking-wider w-fit">
                <Users2 className="w-3.5 h-3.5" />
                <span>Trayectoria y Compromiso</span>
              </div>
              <h1 className="font-heading font-extrabold text-[36px] sm:text-[48px] lg:text-[54px] uppercase tracking-tight leading-[1.05]">
                Quiénes Somos y Cómo Trabajamos
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#C9D6E3] leading-relaxed">
                En Distribuidora Fedar contamos con más de 20 años de trayectoria en el mercado, especializándonos en la distribución de artículos de ferretería, bulonería y repuestos.
              </p>
            </div>

            {config.priceListUrl ? (
              <a
                href={config.priceListUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-xl bg-[#E0A93B] hover:bg-[#F2B94C] text-[#0F1B2D] font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Lista de Precios</span>
              </a>
            ) : (
              <Link
                href="/lista-de-precios"
                className="h-12 px-6 rounded-xl bg-[#E0A93B] hover:bg-[#F2B94C] text-[#0F1B2D] font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Lista de Precios</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 1. Sección Sobre Nosotros (Historia, Trayectoria, Estadísticas) */}
      <AboutSection />

      {/* 2. Sección Cómo Trabajamos (Sistema de Gaveteros y Pasos) */}
      <HowWeWorkSection />

      {/* 3. CTA Comercial */}
      <CtaSection />
    </div>
  );
}
