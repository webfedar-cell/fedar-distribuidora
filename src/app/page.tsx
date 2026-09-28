"use client";

import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesBar } from "@/components/FeaturesBar";
import { ProductsSection } from "@/components/ProductsSection";
import { CtaSection } from "@/components/CtaSection";
import { CheckCircle, FileText, ArrowRight, Users2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Barra de Beneficios */}
      <FeaturesBar />

      {/* 3. Sección de Productos con el Formato Solicitado (11 productos + 1 CTA) */}
      <ProductsSection />

      {/* 4. Banner Destacado: Sobre Nosotros & Gaveteros */}
      <section className="bg-white border-y border-[#DDD8CE] py-14 sm:py-18">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20">
          <div className="bg-[#FAF9F6] border border-[#DDD8CE] rounded-3xl p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0A93B]/20 text-[#8A5F12] font-semibold text-xs uppercase tracking-wider w-fit">
                <Users2 className="w-3.5 h-3.5" />
                <span>Sobre Nosotros y Sistema de Trabajo</span>
              </div>
              <h2 className="font-heading font-extrabold text-[28px] sm:text-[38px] text-[#0F1B2D] uppercase leading-tight">
                El sistema de reposición por corredor que cuida tu mostrador
              </h2>
              <p className="text-[15px] sm:text-[17px] text-[#5A6472] leading-[1.6]">
                Conocé la historia de FEDAR, nuestra trayectoria de más de 20 años abasteciendo comercios en todo el país y el exclusivo <strong>Sistema de Gaveteros</strong> que evita comprar de más y no te deja sin stock.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                  <span>Gaveteros a medida</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                  <span>Visitas periódicas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                  <span>Envíos a todo el país</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <Link
                href="/nosotros"
                className="h-13 px-6 rounded-xl bg-[#0B4A90] hover:bg-[#073568] text-white font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Conocer Más Sobre Nosotros</span>
                <ArrowRight className="w-4 h-4 text-[#E0A93B]" />
              </Link>
              <Link
                href="/lista-de-precios"
                className="h-13 px-6 rounded-xl bg-white border border-[#CFC9BD] hover:bg-[#F3F1EC] text-[#0F1B2D] font-bold text-center flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4 text-[#8A5F12]" />
                <span>Solicitar Lista Mayorista</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <CtaSection />
    </div>
  );
}
