"use client";

import React from "react";
import Link from "next/link";
import { Check, Truck, Store, RefreshCw, Layers, MessageSquare, ArrowRight } from "lucide-react";
import { COMPANY_DATA } from "@/data/products";

export const HowWeWorkSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Te instalamos el gavetero",
      description:
        "Organizador y exhibidor con los artículos y medidas de mayor rotación para tu rubro.",
      icon: Layers,
    },
    {
      num: "02",
      title: "Vendés desde el mostrador",
      description:
        "Cada cajón a la vista: encontrás la medida al instante y ves enseguida lo que se está agotando.",
      icon: Store,
    },
    {
      num: "03",
      title: "El corredor pasa y repone",
      description:
        "Nuestros corredores visitan periódicamente tu comercio y completan lo que vendiste. Si te falta algo antes, pedilo por WhatsApp.",
      icon: RefreshCw,
    },
    {
      num: "04",
      title: "¿Fuera de CABA y GBA?",
      description:
        "Enviamos a todo el país por el transporte que nos designes. Despacho ágil en 24 a 48 hs hábiles.",
      icon: Truck,
    },
  ];

  return (
    <section
      id="como-trabajamos"
      className="bg-white border-t border-b border-[#DDD8CE] py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Columna Izquierda: Introducción del Sistema */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-28">
            <div className="font-heading font-semibold text-[15px] sm:text-[17px] tracking-[3px] uppercase text-[#8A5F12]">
              Sistema FEDAR
            </div>
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.05] text-[#0F1B2D] uppercase tracking-tight">
              El sistema de gaveteros que te hace vender más sin inmovilizar capital.
            </h2>
            <p className="text-[15px] sm:text-[17px] leading-[1.6] text-[#5A6472]">
              Los gaveteros son un stock inicial organizado y exhibido, con las medidas que más rotan.
              Así sabés qué tenés, qué falta y no volvés a comprar de más ni a perder ventas en el mostrador.
            </p>

            <div className="mt-2 p-5 rounded-xl bg-[#F7F5F0] border border-[#DDD8CE] flex flex-col gap-3">
              <div className="font-semibold text-sm text-[#12355B] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#1F8F4E]" />
                <span>¿Por qué funciona tan bien?</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#5A6472] flex flex-col gap-1.5 list-disc list-inside">
                <li>Ahorro de espacio y orden absoluto en el mostrador.</li>
                <li>Etiquetado claro con medidas para despachar en segundos.</li>
                <li>Reposición programada sin costo adicional por visita.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(
                  "Hola FEDAR! Quisiera consultar por el sistema de gaveteros y coordinar una visita para mi comercio."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pedir Gavetero por WhatsApp</span>
              </a>

              <Link
                href="/contacto"
                className="h-12 px-5 rounded-xl border border-[#CFC9BD] hover:bg-[#FAF9F6] text-[#0F1B2D] font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Consultar por zona</span>
                <ArrowRight className="w-4 h-4 text-[#8A5F12]" />
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Pasos Numerados */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#E7E2D8]">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="py-6 sm:py-7 lg:py-8 first:pt-0 last:pb-0 flex items-start gap-5 sm:gap-7 group"
                >
                  {/* Número grande en Barlow Condensed */}
                  <div className="font-heading font-extrabold text-[36px] sm:text-[44px] text-[#E0A93B] w-12 sm:w-16 shrink-0 leading-none group-hover:scale-105 transition-transform">
                    {step.num}
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[18px] sm:text-[20px] text-[#0F1B2D] group-hover:text-[#12355B] transition-colors">
                        {step.title}
                      </h3>
                      <Icon className="w-4 h-4 text-[#8A96A5] opacity-60 group-hover:opacity-100 group-hover:text-[#12355B] transition-all" />
                    </div>
                    <p className="text-[14px] sm:text-[16px] text-[#5A6472] leading-[1.55]">
                      {step.description}
                    </p>
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
