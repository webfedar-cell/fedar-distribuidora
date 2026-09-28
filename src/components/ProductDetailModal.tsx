"use client";

import React from "react";
import { X, MessageSquare, Check, Layers, Store, ArrowRight, ShieldCheck } from "lucide-react";
import { ProductItem, COMPANY_DATA } from "@/data/products";

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onOpenPriceList: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenPriceList,
}) => {
  if (!product) return null;

  const productWhatsappUrl = `https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(
    `Hola FEDAR! Quisiera consultar precios y disponibilidad de la familia ${product.num}. ${product.name}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DDD8CE] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E7E2D8] bg-[#FAF9F6]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A96A5]">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0B4A90]/10 text-[#0B4A90] px-2 py-0.5 rounded-md">
                  {product.subCategory}
                </span>
              )}
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#12355B] leading-none uppercase mt-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#DDD8CE] text-[#5A6472] hover:text-[#0F1B2D] hover:bg-[#F3F1EC] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 sm:p-7 flex flex-col gap-6">
          {/* Imagen si está disponible */}
          {product.imageUrl && (
            <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-[#F3EFE6] border border-[#DDD8CE] flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6472]">
              Descripción del Producto
            </h4>
            <p className="text-sm sm:text-base text-[#0F1B2D] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variedades y Medidas incluidas */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6472]">
              Artículos y Medidas Principales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-[#0F1B2D] bg-[#F7F5F0] p-2.5 rounded-lg border border-[#E7E2D8]"
                >
                  <Check className="w-4 h-4 text-[#1F8F4E] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sistema Gavetero Recomendado */}
          {product.gaveteroOption && (
            <div className="p-4 rounded-xl bg-[#0A1F36] text-white flex items-start gap-3.5 border border-[#1E3B5C]">
              <div className="w-9 h-9 rounded-lg bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#E0A93B]">
                  Opción Gavetero Mostrador
                </div>
                <div className="text-sm text-[#C9D6E3] font-medium">
                  {product.gaveteroOption}
                </div>
              </div>
            </div>
          )}

          {/* Aplicación / Rubros */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#5A6472]">
            <span className="font-semibold text-[#0F1B2D] flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-[#12355B]" />
              Ideal para:
            </span>
            {product.popularIn.map((rubro, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#DDD8CE] text-[#12355B] font-medium"
              >
                {rubro}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Modal con Botones */}
        <div className="p-5 sm:p-6 border-t border-[#E7E2D8] bg-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenPriceList();
            }}
            className="w-full sm:w-auto text-sm font-semibold text-[#12355B] hover:text-[#0A1F36] flex items-center justify-center gap-1.5 cursor-pointer py-2"
          >
            <span>Ver lista de precios completa</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[#1F8F4E] hover:bg-[#187A41] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Consultar disponibilidad</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
