"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { CATEGORIES_LIST, COMPANY_DATA, ProductItem } from "@/data/products";
import { useModals } from "@/context/ModalContext";

export default function ProductosPage() {
  const modals = useModals();
  const catalogTopRef = useRef<HTMLDivElement>(null);

  const [productsList, setProductsList] = useState<ProductItem[]>(CATEGORIES_LIST);
  const [categories, setCategories] = useState<{ id: string | number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<
    { id: string | number; name: string; category_id?: number | string; category_name?: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("todas");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);

  // Paginación (11, 23 o 47 para sumar la tarjeta de lista de precios y completar la grilla)
  const [pageSize, setPageSize] = useState<number>(11);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch dynamic products, categories and subcategories from MySQL API
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, subRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/subcategories"),
        ]);

        if (prodRes.ok) {
          const json = await prodRes.json();
          if (json.data && json.data.length > 0) {
            setProductsList(json.data);
          }
        }

        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.data && catJson.data.length > 0) {
            setCategories(catJson.data);
          }
        }

        if (subRes.ok) {
          const subJson = await subRes.json();
          if (subJson.data && subJson.data.length > 0) {
            setSubcategories(subJson.data);
          }
        }
      } catch {
        // Fallback to static data
      }
    }
    loadData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchFilter, pageSize]);

  // Compute unique categories with count
  const categoriesWithCounts = useMemo(() => {
    const list = categories.length > 0 ? categories.map((c) => c.name) : Array.from(new Set(productsList.map((p) => p.category).filter(Boolean)));
    return list.map((catName) => {
      const count = productsList.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;
      return { name: catName, count };
    }).filter((c) => c.count > 0 || categories.length > 0);
  }, [categories, productsList]);

  // Available subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "todos") {
      const uniqueSubs = Array.from(
        new Set(productsList.map((p) => p.subCategory).filter(Boolean) as string[])
      );
      return uniqueSubs.sort((a, b) => a.localeCompare(b));
    }
    const filteredSubs = productsList
      .filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase() && p.subCategory)
      .map((p) => p.subCategory as string);
    return Array.from(new Set(filteredSubs)).sort((a, b) => a.localeCompare(b));
  }, [productsList, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // Category match
      const categoryMatches =
        selectedCategory === "todos"
          ? true
          : item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Subcategory match
      const subCategoryMatches =
        selectedSubcategory === "todas"
          ? true
          : item.subCategory &&
            item.subCategory.toLowerCase() === selectedSubcategory.toLowerCase();

      // Search match
      const search = searchFilter.toLowerCase().trim();
      const searchMatches =
        !search ||
        item.name.toLowerCase().includes(search) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(search)) ||
        item.shortDesc.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.items.some((sub) => sub.toLowerCase().includes(search));

      return categoryMatches && subCategoryMatches && searchMatches;
    });
  }, [productsList, selectedCategory, selectedSubcategory, searchFilter]);

  // Paginación calculada
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(startIdx, startIdx + pageSize);
  }, [filteredProducts, safeCurrentPage, pageSize]);

  const startIndex = (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, filteredProducts.length);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("todos");
    setSelectedSubcategory("todas");
    setSearchFilter("");
  };

  // Helper para generar números de página visibles
  const getVisiblePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, safeCurrentPage - 2);
      let end = Math.min(totalPages, safeCurrentPage + 2);

      if (safeCurrentPage <= 3) {
        start = 1;
        end = 5;
      } else if (safeCurrentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-full" ref={catalogTopRef}>
      {/* Contenido Principal del Catálogo */}
      <section className="py-10 sm:py-14 lg:py-18 px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full flex flex-col gap-8 sm:gap-10">
        {/* Header idéntico al formato solicitado */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <div className="font-heading font-semibold text-[13px] sm:text-[14px] tracking-[2.5px] uppercase text-[#8A5F12]">
              Catálogo Completo
            </div>
            <h1 className="font-heading font-extrabold text-[34px] sm:text-[44px] lg:text-[50px] leading-none text-[#0F1B2D] uppercase tracking-tight">
              Nuestros productos
            </h1>
          </div>

          <Link
            href="/lista-de-precios"
            className="font-semibold text-[14px] sm:text-[15px] text-[#0F1B2D] hover:text-[#0B4A90] border-b-2 border-[#E0A93B] pb-0.5 w-fit flex items-center gap-1.5 transition-all group shrink-0"
          >
            <span>Ver lista de precios mayorista</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#0F1B2D] group-hover:text-[#0B4A90]" />
          </Link>
        </div>

        {/* Panel de Búsqueda y Filtros de Categorías/Subcategorías */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD8CE] shadow-xs flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Input de Búsqueda por texto */}
            <div className="relative md:col-span-4 lg:col-span-5">
              <input
                type="search"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por nombre, código o medida…"
                className="w-full h-12 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#0B4A90] focus:bg-white rounded-xl pl-10 pr-4 text-sm text-[#0F1B2D] outline-hidden transition-all"
              />
              <Search className="w-4.5 h-4.5 text-[#8A96A5] absolute left-3.5 top-3.5" />
            </div>

            {/* Select Desplegable de Categorías (Listado Completo) */}
            <div className="relative md:col-span-4 lg:col-span-4">
              <label htmlFor="categoria-select" className="sr-only">Categoría</label>
              <select
                id="categoria-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("todas");
                }}
                className="w-full h-12 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#0B4A90] focus:bg-white rounded-xl px-3.5 text-sm font-semibold text-[#0F1B2D] outline-hidden cursor-pointer transition-all uppercase truncate"
              >
                <option value="todos">Todas las categorías ({productsList.length} productos)</option>
                {categoriesWithCounts.map((cat, idx) => (
                  <option key={idx} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Desplegable de Subcategorías (si hay disponibles) */}
            <div className="relative md:col-span-4 lg:col-span-3">
              <label htmlFor="subcategoria-select" className="sr-only">Subcategoría</label>
              <select
                id="subcategoria-select"
                value={selectedSubcategory}
                disabled={availableSubcategories.length === 0}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full h-12 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#0B4A90] focus:bg-white rounded-xl px-3.5 text-sm font-semibold text-[#0F1B2D] outline-hidden cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase truncate"
              >
                <option value="todas">
                  {availableSubcategories.length > 0
                    ? `Todas las subcategorías (${availableSubcategories.length})`
                    : "Sin subcategorías"}
                </option>
                {availableSubcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila de Filtros Activos y Botón Ver Todas las Categorías */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0ECE1] text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#5A6472] uppercase tracking-wider">Filtro actual:</span>

              {selectedCategory === "todos" && selectedSubcategory === "todas" && !searchFilter ? (
                <span className="px-2.5 py-1 rounded-md bg-[#FAF9F6] text-[#8A96A5] border border-[#E7E2D8]">
                  Mostrando todo el catálogo
                </span>
              ) : (
                <>
                  {selectedCategory !== "todos" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B4A90] text-white font-semibold">
                      <span>Categoría: {selectedCategory}</span>
                      <button
                        onClick={() => {
                          setSelectedCategory("todos");
                          setSelectedSubcategory("todas");
                        }}
                        className="hover:text-[#E0A93B] cursor-pointer"
                        title="Quitar categoría"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedSubcategory !== "todas" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#12355B] text-white font-semibold">
                      <span>Subcategoría: {selectedSubcategory}</span>
                      <button
                        onClick={() => setSelectedSubcategory("todas")}
                        className="hover:text-[#E0A93B] cursor-pointer"
                        title="Quitar subcategoría"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {searchFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E0A93B]/20 text-[#8A5F12] border border-[#E0A93B]/40 font-semibold">
                      <span>Búsqueda: "{searchFilter}"</span>
                      <button
                        onClick={() => setSearchFilter("")}
                        className="hover:text-black cursor-pointer"
                        title="Borrar búsqueda"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleResetFilters}
                    className="text-[#0B4A90] hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Restablecer filtros
                  </button>
                </>
              )}
            </div>

            {/* Botón para abrir modal con el listado completo de categorías en grilla */}
            <button
              onClick={() => setShowCategoriesModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#F3F1EC] hover:bg-[#E5E0D5] text-[#0F1B2D] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Filter className="w-3.5 h-3.5 text-[#0B4A90]" />
              <span>Explorar todas las categorías ({categoriesWithCounts.length})</span>
            </button>
          </div>
        </div>

        {/* Modal para Explorar Todas las Categorías en Grilla Completa */}
        {showCategoriesModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
            onClick={() => setShowCategoriesModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#DDD8CE]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 sm:p-6 bg-[#FAF9F6] border-b border-[#E7E2D8] flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-[#0F1B2D] uppercase">
                    Todas las Categorías del Catálogo
                  </h3>
                  <p className="text-xs text-[#5A6472]">
                    Seleccioná una categoría para filtrar los productos correspondientes
                  </p>
                </div>
                <button
                  onClick={() => setShowCategoriesModal(false)}
                  className="w-9 h-9 rounded-full bg-white border border-[#DDD8CE] text-[#5A6472] hover:text-[#0F1B2D] flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <button
                  onClick={() => {
                    setSelectedCategory("todos");
                    setSelectedSubcategory("todas");
                    setShowCategoriesModal(false);
                  }}
                  className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm uppercase transition-all cursor-pointer border ${
                    selectedCategory === "todos"
                      ? "bg-[#0B4A90] text-white border-[#0B4A90]"
                      : "bg-[#FBFBFA] hover:bg-[#F3F1EC] text-[#0F1B2D] border-[#E7E2D8]"
                  }`}
                >
                  🌟 Todos los productos ({productsList.length})
                </button>

                {categoriesWithCounts.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubcategory("todas");
                      setShowCategoriesModal(false);
                    }}
                    className={`p-3 rounded-xl text-left font-semibold text-xs sm:text-sm uppercase transition-all cursor-pointer border flex items-center justify-between gap-2 ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-[#0B4A90] text-white border-[#0B4A90]"
                        : "bg-[#FBFBFA] hover:bg-[#F3F1EC] text-[#0F1B2D] border-[#E7E2D8]"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? "bg-white/20 text-white"
                          : "bg-[#E7E2D8] text-[#5A6472]"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#FAF9F6] border-t border-[#E7E2D8] flex justify-end">
                <button
                  onClick={() => setShowCategoriesModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#0F1B2D] text-white font-semibold text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra Superior con Contador y Selector de Productos por Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#5A6472] -mt-2">
          <div>
            {filteredProducts.length > 0 ? (
              <>
                Mostrando <strong>{startIndex}</strong> – <strong>{endIndex}</strong> de{" "}
                <strong>{filteredProducts.length}</strong> productos
              </>
            ) : (
              <>0 productos encontrados</>
            )}
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="ml-3 text-xs text-[#0B4A90] hover:underline font-semibold cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {/* Selector de cantidad por página (11 / 23 / 47) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-[#5A6472]">Ver por página:</span>
            <div className="inline-flex bg-[#F3F1EC] p-1 rounded-xl border border-[#DDD8CE]">
              {[11, 23, 47].map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pageSize === size
                      ? "bg-[#0B4A90] text-white shadow-xs"
                      : "text-[#5A6472] hover:text-[#0F1B2D]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grilla 4 Columnas con Formato de Tarjetas Paginadas */}
        {paginatedProducts.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {paginatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/productos/${product.id}`}
                  className="bg-white rounded-xl border border-[#DDD8CE] hover:border-[#0B4A90] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg group cursor-pointer"
                >
                  {/* Contenedor Superior con Foto real o Badge */}
                  <div className="relative h-48 sm:h-52 w-full flex items-center justify-center p-3 select-none overflow-hidden bg-[#FBFBFA]">
                    {/* Foto real o Badge Central */}
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

              {/* Tarjeta CTA: VER EL CATÁLOGO COMPLETO / LISTA DE PRECIOS */}
              <Link
                href="/lista-de-precios"
                className="bg-[#0F2F52] hover:bg-[#0A223C] rounded-xl p-6 sm:p-7 flex flex-col justify-between text-white transition-all duration-300 shadow-md hover:shadow-xl group min-h-[220px]"
              >
                <div className="font-heading font-extrabold text-[28px] sm:text-[32px] lg:text-[34px] leading-[0.98] uppercase text-white tracking-tight pt-1">
                  Ver lista de precios completa
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#C9D6E3] pt-4 border-t border-white/15 group-hover:text-white transition-colors">
                  <span>Descargar en Excel y PDF</span>
                  <ArrowRight className="w-4.5 h-4.5 text-[#E0A93B] group-hover:translate-x-1.5 transition-transform shrink-0" />
                </div>
              </Link>
            </div>

            {/* Paginador Inferior Completo */}
            {totalPages > 1 && (
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                {/* Texto de estado de página */}
                <div className="text-xs sm:text-sm text-[#5A6472] font-medium text-center sm:text-left">
                  Página <strong>{safeCurrentPage}</strong> de <strong>{totalPages}</strong>
                </div>

                {/* Botones de navegación */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Ir a primera página */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Primera página"
                    className="w-9 h-9 rounded-xl border border-[#DDD8CE] flex items-center justify-center text-[#5A6472] hover:bg-[#F3F1EC] hover:text-[#0F1B2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Página Anterior */}
                  <button
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="h-9 px-3 rounded-xl border border-[#DDD8CE] flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5A6472] hover:bg-[#F3F1EC] hover:text-[#0F1B2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  {/* Números de Página */}
                  <div className="flex items-center gap-1">
                    {getVisiblePageNumbers().map((num, idx) =>
                      typeof num === "number" ? (
                        <button
                          key={idx}
                          onClick={() => goToPage(num)}
                          className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            safeCurrentPage === num
                              ? "bg-[#0B4A90] text-white shadow-xs"
                              : "border border-[#DDD8CE] text-[#5A6472] hover:bg-[#F3F1EC] hover:text-[#0F1B2D]"
                          }`}
                        >
                          {num}
                        </button>
                      ) : (
                        <span key={idx} className="w-7 text-center text-[#8A96A5] text-xs">
                          {num}
                        </span>
                      )
                    )}
                  </div>

                  {/* Página Siguiente */}
                  <button
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="h-9 px-3 rounded-xl border border-[#DDD8CE] flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5A6472] hover:bg-[#F3F1EC] hover:text-[#0F1B2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Ir a última página */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Última página"
                    className="w-9 h-9 rounded-xl border border-[#DDD8CE] flex items-center justify-center text-[#5A6472] hover:bg-[#F3F1EC] hover:text-[#0F1B2D] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#DDD8CE] p-12 text-center flex flex-col items-center justify-center gap-3">
            <Search className="w-10 h-10 text-[#C5BCAE]" />
            <h3 className="font-heading font-bold text-xl text-[#0F1B2D]">
              No se encontraron productos para "{searchFilter}"
            </h3>
            <p className="text-sm text-[#5A6472] max-w-md">
              Probá con otro término de búsqueda o revisá todas las categorías disponibles en nuestro catálogo.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0B4A90] text-white font-semibold text-sm cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* Banner Inferior de Contacto / WhatsApp */}
        <div className="mt-6 bg-[#FAF9F6] border border-[#DDD8CE] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E0A93B]/20 border border-[#E0A93B]/40 flex items-center justify-center text-[#8A5F12] shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-heading font-extrabold text-2xl text-[#0F1B2D] uppercase">
                ¿Querés recibir la lista de precios en tu WhatsApp?
              </h4>
              <p className="text-sm text-[#5A6472]">
                Te enviamos el archivo actualizado con códigos y condiciones comerciales al instante.
              </p>
            </div>
          </div>

          <a
            href={COMPANY_DATA.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-7 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-md"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
