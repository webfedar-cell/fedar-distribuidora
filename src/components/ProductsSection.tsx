"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES_LIST, ProductItem } from "@/data/products";
import { useModals } from "@/context/ModalContext";

interface ProductsSectionProps {
  onSelectProduct?: (product: ProductItem) => void;
  onOpenPriceListModal?: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onOpenPriceListModal,
}) => {
  const modals = useModals();
  const handleSelect = onSelectProduct || modals.openProductModal;

  const [products, setProducts] = useState<ProductItem[]>(CATEGORIES_LIST);

  // Fetch dynamic products from MySQL API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setProducts(json.data.slice(0, 11)); // Display first 11 on Home + Card 12
          }
        }
      } catch {
        // Keeps default CATEGORIES_LIST
      }
    }
    fetchProducts();
  }, []);

  return (
    <section
      id="productos"
      className="py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full flex flex-col gap-8 sm:gap-10"
    >
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <div className="font-heading font-semibold text-[13px] sm:text-[14px] tracking-[2.5px] uppercase text-[#8A5F12]">
            Catálogo
          </div>
          <h2 className="font-heading font-extrabold text-[34px] sm:text-[44px] lg:text-[50px] leading-none text-[#0F1B2D] uppercase tracking-tight">
            Nuestros productos
          </h2>
        </div>

        <Link
          href="/productos"
          className="font-semibold text-[14px] sm:text-[15px] text-[#0F1B2D] hover:text-[#0B4A90] border-b-2 border-[#E0A93B] pb-0.5 w-fit flex items-center gap-1.5 transition-all group shrink-0"
        >
          <span>Ver catálogo completo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#0F1B2D] group-hover:text-[#0B4A90]" />
        </Link>
      </div>

      {/* Grilla 4 Columnas con las 11 tarjetas de producto + Tarjeta 12 CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/productos/${product.id}`}
            className="bg-white rounded-xl border border-[#DDD8CE] hover:border-[#0B4A90] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg group cursor-pointer"
          >
            {/* Contenedor Superior con Foto real o Badge */}
            <div className="relative h-48 sm:h-52 w-full flex items-center justify-center p-3 select-none overflow-hidden bg-[#FBFBFA]">
              {/* Imagen real o Badge Central: Foto: [Nombre] */}
              {product.imageUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="self-center my-auto z-10">
                  <div className="border border-dashed border-[#B8B0A2] bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] text-[#4A5568] font-medium shadow-2xs group-hover:bg-white transition-colors">
                    {product.photoLabel || `Foto: ${product.name}`}
                  </div>
                </div>
              )}
            </div>

            {/* Barra Inferior Blanca con Nombre en Negrita y Flecha */}
            <div className="bg-white px-4 py-3.5 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
              <span className="font-heading font-extrabold text-[15px] sm:text-[16px] tracking-wide text-[#0F1B2D] uppercase group-hover:text-[#0B4A90] transition-colors line-clamp-1">
                {product.name}
              </span>
              <ArrowRight className="w-4 h-4 text-[#0F1B2D] group-hover:translate-x-1 group-hover:text-[#0B4A90] transition-all shrink-0" />
            </div>
          </Link>
        ))}

        {/* Tarjeta 12: VER EL CATÁLOGO COMPLETO */}
        <Link
          href="/productos"
          className="bg-[#0F2F52] hover:bg-[#0A223C] rounded-xl p-6 sm:p-7 flex flex-col justify-between text-white transition-all duration-300 shadow-md hover:shadow-xl group min-h-[220px]"
        >
          {/* Título Principal en Barlow Condensed */}
          <div className="font-heading font-extrabold text-[28px] sm:text-[32px] lg:text-[34px] leading-[0.98] uppercase text-white tracking-tight pt-1">
            Ver el catálogo completo
          </div>

          {/* Pie de Tarjeta con Enlace y Flecha Dorada */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#C9D6E3] pt-4 border-t border-white/15 group-hover:text-white transition-colors">
            <span>Todas las familias y medidas</span>
            <ArrowRight className="w-4.5 h-4.5 text-[#E0A93B] group-hover:translate-x-1.5 transition-transform shrink-0" />
          </div>
        </Link>
      </div>
    </section>
  );
};
