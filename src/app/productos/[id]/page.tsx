"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  FileSpreadsheet,
  Check,
  Layers,
  Store,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Share2,
} from "lucide-react";
import { ProductItem, COMPANY_DATA, CATEGORIES_LIST } from "@/data/products";
import { useModals } from "@/context/ModalContext";

interface ProductDetailResponse extends ProductItem {
  allPhotos?: string[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const modals = useModals();

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhoto, setActivePhoto] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setProduct(json.data);
            const firstImg =
              (json.data.allPhotos && json.data.allPhotos[0]) ||
              json.data.imageUrl ||
              "";
            setActivePhoto(firstImg);
          }
        } else {
          // Fallback to static data
          const fallback = CATEGORIES_LIST.find(
            (p) =>
              p.id.toLowerCase() === productId.toLowerCase() ||
              p.name.toLowerCase() === decodeURIComponent(productId).toLowerCase()
          );
          if (fallback) {
            setProduct({
              ...fallback,
              allPhotos: fallback.imageUrl ? [fallback.imageUrl] : [],
            });
            setActivePhoto(fallback.imageUrl || "");
          }
        }
      } catch {
        // Fallback
        const fallback = CATEGORIES_LIST.find(
          (p) =>
            p.id.toLowerCase() === productId.toLowerCase() ||
            p.name.toLowerCase() === decodeURIComponent(productId).toLowerCase()
        );
        if (fallback) {
          setProduct({
            ...fallback,
            allPhotos: fallback.imageUrl ? [fallback.imageUrl] : [],
          });
          setActivePhoto(fallback.imageUrl || "");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.4, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.4, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-12 h-12 border-4 border-[#0B4A90] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#5A6472]">Cargando detalle del producto…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 py-20 px-4 text-center">
        <h2 className="font-heading font-extrabold text-3xl text-[#0F1B2D]">
          Producto no encontrado
        </h2>
        <p className="text-sm text-[#5A6472] max-w-md">
          El producto solicitado no existe o fue retirado temporalmente del catálogo.
        </p>
        <Link
          href="/productos"
          className="px-6 py-3 rounded-xl bg-[#0B4A90] hover:bg-[#083668] text-white font-semibold text-sm transition-all"
        >
          Volver al catálogo de productos
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Hola FEDAR! Quisiera consultar precios mayoristas y disponibilidad del producto: *${product.name}* (Categoría: ${product.category}). Link: ${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappUrl = `https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const photosList =
    product.allPhotos && product.allPhotos.length > 0
      ? product.allPhotos
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  return (
    <div className="flex flex-col min-h-full bg-[#FAF9F6]">
      {/* Barra de Navegación / Breadcrumbs */}
      <div className="border-b border-[#E7E2D8] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 py-3.5 flex items-center justify-between gap-4 flex-wrap text-xs sm:text-sm">
          <nav className="flex items-center gap-2 text-[#5A6472] flex-wrap">
            <Link href="/" className="hover:text-[#0B4A90] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5BCAE]" />
            <Link href="/productos" className="hover:text-[#0B4A90] transition-colors">
              Productos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5BCAE]" />
            <span className="text-[#8A96A5]">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5BCAE]" />
            <span className="font-bold text-[#0F1B2D] truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <Link
            href="/productos"
            className="flex items-center gap-1.5 text-xs font-bold text-[#0B4A90] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo</span>
          </Link>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-[1720px] mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Columna Izquierda: Visor de Imagen Grande (9 cols en lg / 10 cols en xl) */}
          <div className="lg:col-span-9 xl:col-span-10 flex flex-col gap-4">
            {/* Contenedor del Visor */}
            <div className="relative bg-white rounded-2xl border border-[#DDD8CE] shadow-sm overflow-hidden flex flex-col">
              {/* Barra superior del visor con controles de zoom */}
              <div className="p-3 sm:p-4 bg-[#FBFBFA] border-b border-[#E7E2D8] flex items-center justify-between gap-2 z-10">
                <div className="text-xs font-semibold text-[#5A6472] flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#1F8F4E]" />
                  <span className="font-bold text-[#0F1B2D]">Folleto Técnico y Tabla de Medidas</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    title="Alejar"
                    className="w-8 h-8 rounded-lg bg-white border border-[#DDD8CE] text-[#5A6472] hover:text-[#0F1B2D] hover:bg-[#F3F1EC] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#5A6472] w-12 text-center select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    title="Acercar detalle"
                    className="w-8 h-8 rounded-lg bg-white border border-[#DDD8CE] text-[#5A6472] hover:text-[#0F1B2D] hover:bg-[#F3F1EC] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {zoomLevel > 1 && (
                    <button
                      onClick={handleResetZoom}
                      title="Restablecer tamaño"
                      className="w-8 h-8 rounded-lg bg-white border border-[#DDD8CE] text-[#5A6472] hover:text-[#0F1B2D] hover:bg-[#F3F1EC] flex items-center justify-center transition-all cursor-pointer ml-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {activePhoto && (
                    <button
                      onClick={() => setIsFullscreen(true)}
                      title="Ver en pantalla completa"
                      className="h-8 px-2.5 rounded-lg bg-[#0B4A90] text-white hover:bg-[#083668] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ml-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ampliar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Área del lienzo de imagen con scroll/zoom interactivo y altura generosa */}
              <div className="relative min-h-[550px] sm:min-h-[750px] lg:min-h-[900px] xl:min-h-[1000px] max-h-[1150px] w-full bg-[#FFFFFF] overflow-auto flex items-center justify-center p-3 sm:p-6 select-none">
                {activePhoto ? (
                  <div
                    className="transition-transform duration-200 ease-out origin-center cursor-zoom-in flex items-center justify-center w-full"
                    style={{
                      transform: `scale(${zoomLevel})`,
                    }}
                    onClick={() => {
                      if (zoomLevel === 1) handleZoomIn();
                      else handleResetZoom();
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activePhoto}
                      alt={product.name}
                      className="max-h-[960px] w-auto max-w-full object-contain drop-shadow-md rounded-lg mx-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-12 text-center text-[#8A96A5]">
                    <div className="border-2 border-dashed border-[#DDD8CE] rounded-2xl p-10 bg-[#FAF9F6]">
                      <span className="font-heading font-bold text-xl uppercase tracking-wider text-[#5A6472]">
                        {product.photoLabel || `Foto: ${product.name}`}
                      </span>
                    </div>
                    <span className="text-xs">Imagen técnica en proceso de digitalización</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#FBFBFA] border-t border-[#E7E2D8] text-[12px] text-[#8A96A5] text-center flex items-center justify-center gap-2">
                <span>💡 Hacé clic en la imagen o usá los botones de arriba para ampliar los detalles y tablas de medidas.</span>
              </div>
            </div>

            {/* Galería de miniaturas (si tiene más de 1 foto) */}
            {photosList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {photosList.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActivePhoto(photo);
                      setZoomLevel(1);
                    }}
                    className={`relative w-20 h-20 rounded-xl bg-white border-2 overflow-hidden shrink-0 transition-all cursor-pointer p-1 ${
                      activePhoto === photo
                        ? "border-[#0B4A90] shadow-md scale-105"
                        : "border-[#DDD8CE] hover:border-[#8A96A5] opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha Compacta y Sticky (3 cols en lg / 2 cols en xl) */}
          <div className="lg:col-span-3 xl:col-span-2 flex flex-col gap-3.5 lg:sticky lg:top-20">
            {/* Header del producto */}
            <div className="bg-white rounded-2xl border border-[#DDD8CE] p-5 sm:p-6 shadow-sm flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F3F1EC] text-[#5A6472] px-2.5 py-0.5 rounded-md border border-[#DDD8CE]">
                    {product.category}
                  </span>
                  {product.subCategory && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0B4A90]/10 text-[#0B4A90] px-2.5 py-0.5 rounded-md border border-[#0B4A90]/20">
                      {product.subCategory}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  title="Copiar enlace"
                  className="w-8 h-8 rounded-lg border border-[#DDD8CE] text-[#5A6472] hover:text-[#0B4A90] hover:bg-[#F3F1EC] flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {copied && (
                <div className="text-[11px] text-[#1F8F4E] font-bold bg-[#1F8F4E]/10 py-1 px-2.5 rounded-md w-fit">
                  ✓ Enlace copiado
                </div>
              )}

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-xs sm:text-sm text-[#5A6472] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Botón Acción Rápida WhatsApp */}
              <div className="pt-1 flex flex-col gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Consultar por WhatsApp</span>
                </a>

                <Link
                  href="/lista-de-precios"
                  className="w-full h-10 rounded-xl bg-[#0F2F52] hover:bg-[#0A223C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#E0A93B]" />
                  <span>Solicitar lista de precios</span>
                </Link>
              </div>
            </div>

            {/* Artículos y Medidas Principales */}
            <div className="bg-white rounded-2xl border border-[#DDD8CE] p-4 sm:p-5 shadow-sm flex flex-col gap-2.5">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#0F1B2D] uppercase tracking-wide">
                Variedades y Medidas
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {product.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#0F1B2D] bg-[#FBFBFA] p-2.5 rounded-lg border border-[#E7E2D8]"
                  >
                    <Check className="w-3.5 h-3.5 text-[#1F8F4E] shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opción Gavetero Organizador */}
            {product.gaveteroOption && (
              <div className="p-4 rounded-xl bg-[#0A1F36] text-white flex items-start gap-3 border border-[#1E3B5C] shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#E0A93B]">
                    Sistema de Gaveteros
                  </div>
                  <div className="text-xs text-[#E2E8F0] font-medium leading-relaxed">
                    {product.gaveteroOption}
                  </div>
                </div>
              </div>
            )}

            {/* Rubros recomendados */}
            <div className="bg-white rounded-2xl border border-[#DDD8CE] p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472] flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#0B4A90]" />
                Comercios sugeridos
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.popularIn.map((rubro, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#DDD8CE] text-[11px] font-semibold text-[#0F1B2D]"
                  >
                    {rubro}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Lightbox de Pantalla Completa para ver las fotos en detalle gigante */}
      {isFullscreen && activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Barra superior del visor pantalla completa */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-xl uppercase text-white">
                {product.name}
              </span>
              <span className="text-xs text-[#C9D6E3] hidden sm:inline">
                ({product.category})
              </span>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Imagen en gran resolución */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto}
              alt={product.name}
              className="max-h-[85vh] max-w-full object-contain rounded-xl drop-shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
