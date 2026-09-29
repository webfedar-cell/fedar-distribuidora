"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";

export interface HeroSlideItem {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  linkUrl?: string;
}

const INITIAL_FALLBACK_SLIDES: HeroSlideItem[] = [
  {
    id: "slide-organizadores",
    image: "https://fedardistribuidora.com.ar/uploads/EVITA%20SOLDADURA%20(1).jpg",
    title: "PRACTICOS ORGANIZADORES PARA TODOS LOS ARTICULOS",
    subtitle: "Sistema Mostrador",
    badge: "+1.500 ferreterías y buloneras activas",
    linkUrl: "/productos",
  },
  {
    id: "slide-resortes",
    image: "https://fedardistribuidora.com.ar/uploads/RESORTES.jpg",
    title: "Línea Completa de Resortes",
    subtitle: "Ferretería & Automotor",
    badge: "Surtido amplio de medidas",
    linkUrl: "/productos",
  },
  {
    id: "slide-exhibidor",
    image: "https://fedardistribuidora.com.ar/uploads/54%20PLASTICO%201%20(4)%20(1)%20(3)%20(1)%20(1).jpg",
    title: "EXHIBIDOR INCLUIDO EN CADA GAVETERO",
    subtitle: "Organización de Mostrador",
    badge: "Exhibidor incluido con el surtido",
    linkUrl: "/productos",
  },
  {
    id: "slide-flyer",
    image: "https://fedardistribuidora.com.ar/uploads/flyer-001.jpg",
    title: "Fichas, Conectores y Accesorios",
    subtitle: "Electricidad y Repuestos",
    badge: "Stock permanente para entrega inmediata",
    linkUrl: "/productos",
  },
];

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlideItem[]>(INITIAL_FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch dynamic slides from API
  useEffect(() => {
    let isMounted = true;
    async function fetchSlides() {
      try {
        const res = await fetch("/api/slides");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.slides && data.slides.length > 0) {
            setSlides(data.slides);
          }
        }
      } catch {
        // Retain initial fallbacks
      }
    }
    fetchSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = slides.length;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, goToNext, total]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      className="relative w-full max-w-[460px] sm:max-w-[500px] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Badge flotante Superior (dinámico con ajuste automático al largo del título) */}
      <div className="absolute -top-4 -left-2 sm:-left-5 z-30 max-w-[calc(100%+16px)] sm:max-w-[105%] bg-[#0A1F36]/95 border border-[#4873A2] rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-2.5 sm:gap-3 transition-all duration-300">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#E0A93B]/20 border border-[#E0A93B]/40 flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#E0A93B]" />
        </div>
        <div className="flex flex-col min-w-0 pr-1">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A5BCD4] font-semibold">
            {currentSlide.subtitle || "Sistema Mostrador"}
          </div>
          <div className="text-[12px] sm:text-[13.5px] font-bold text-white tracking-wide leading-tight">
            {currentSlide.title || "Organizador de Mostrador"}
          </div>
        </div>
      </div>

      {/* Contenedor Principal del Slider con Marco de Cristal */}
      <div className="relative rounded-2xl overflow-hidden p-2.5 sm:p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Contenedor de la Imagen */}
        <div className="relative aspect-4/3 w-full flex items-center justify-center bg-[#07192C]/80 rounded-xl overflow-hidden">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 flex items-center justify-center p-3 transition-all duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                <Link
                  href={slide.linkUrl || "/productos"}
                  className="relative w-full h-full flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      // Fallback to default gavetero if external URL fails
                      if (e.currentTarget.src !== window.location.origin + "/images/gavetero.png") {
                        e.currentTarget.src = "/images/gavetero.png";
                      }
                    }}
                  />
                </Link>
              </div>
            );
          })}

          {/* Flecha Izquierda */}
          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Slide anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A1F36]/80 hover:bg-[#0A1F36] border border-white/25 hover:border-[#E0A93B] text-white hover:text-[#E0A93B] flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer backdrop-blur-xs opacity-75 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Flecha Derecha */}
          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Slide siguiente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A1F36]/80 hover:bg-[#0A1F36] border border-white/25 hover:border-[#E0A93B] text-white hover:text-[#E0A93B] flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer backdrop-blur-xs opacity-75 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Indicadores / Puntos de Paginación */}
          {total > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#07192C]/80 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-xs shadow-md">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(idx);
                    }}
                    aria-label={`Ir al slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "w-6 bg-[#E0A93B]"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Badge flotante Inferior */}
      <div className="absolute -bottom-4 -right-2 sm:-right-4 z-30 bg-[#12355B]/95 border border-[#6F8BAA] rounded-xl px-4 py-2 shadow-2xl backdrop-blur-md flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-xs font-semibold text-white tracking-wide">
          {currentSlide.badge || "+1.500 ferreterías y buloneras activas"}
        </span>
      </div>
    </div>
  );
};
