"use client";

import React from "react";
import { Shield, Award, Users2, Clock, CheckCircle } from "lucide-react";

export const AboutSection: React.FC = () => {
  const stats = [
    { value: "+20", label: "Años de experiencia", icon: Clock },
    { value: "+3.000", label: "Artículos en catálogo", icon: Award },
    { value: "+1.500", label: "Comercios atendidos", icon: Users2 },
    { value: "100%", label: "Cobertura nacional", icon: Shield },
  ];

  return (
    <section id="nosotros" className="py-16 sm:py-20 lg:py-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20">
      <div className="bg-[#FAF9F6] border border-[#DDD8CE] rounded-2xl p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="font-heading font-semibold text-[15px] sm:text-[17px] tracking-[3px] uppercase text-[#8A5F12]">
              Sobre Nosotros
            </div>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] leading-[1.1] text-[#0F1B2D] uppercase tracking-tight">
              ESPECIALISTAS EN SISTEMA DE GAVETEROS: VENTA, EXHIBICIÓN Y REPOSICIÓN INTELIGENTE
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#5A6472] leading-[1.6]">
              Diseñado específicamente para ordenar artículos pequeños (como terminales, orings, arandelas, tuercas, etc etc. ). Funciona con un muestrario visual que deja todo a la vista de tus clientes para incentivar la venta, ofreciéndote además un sistema de reposición fácil, ordenado y periódico a través de nuestros corredores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                <span>Atención personalizada por zona</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                <span>Precios competitivos y transparentes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                <span>Mas de 100 gaveteros diferentes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0F1B2D] font-medium">
                <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0" />
                <span>Despacho express a expresos y transportes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E2DDD2] rounded-xl p-5 sm:p-6 flex flex-col items-center text-center gap-2 shadow-xs hover:border-[#12355B] transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F4EFE6] text-[#12355B] flex items-center justify-center mb-1">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-heading font-extrabold text-[32px] sm:text-[38px] text-[#12355B] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5A6472] font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
