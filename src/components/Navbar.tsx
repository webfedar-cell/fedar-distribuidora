"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ArrowRight, FileText } from "lucide-react";
import { COMPANY_DATA, CATEGORIES_LIST, ProductItem } from "@/data/products";
import { useModals } from "@/context/ModalContext";
import { Logo } from "@/components/Logo";

interface NavbarProps {
  onSelectProduct?: (product: ProductItem) => void;
  onOpenPriceListModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectProduct, onOpenPriceListModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const modals = useModals();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSelectProduct = onSelectProduct || modals.openProductModal;

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = CATEGORIES_LIST.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(query)) ||
        item.shortDesc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.items.some((sub) => sub.toLowerCase().includes(query))
    );
    setSearchResults(results);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectFromSearch = (product: ProductItem) => {
    router.push(`/productos/${product.id}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DDD8CE] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 h-[76px] sm:h-[92px] flex items-center justify-between gap-4">
        {/* Logo Oficial & Subtítulo */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <Link href="/" className="flex items-center group">
            <Logo variant="blue" className="transition-transform group-hover:scale-[1.02]" />
          </Link>
          <div className="hidden xl:block w-px h-9 bg-[#DDD8CE]" />
          <div className="hidden xl:block text-[12px] sm:text-[13px] leading-[1.35] text-[#5A6472] max-w-[190px]">
            Accesorios para ferreterías, buloneras y repuesteros
          </div>
        </div>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] xl:text-[16px] font-medium text-[#0F1B2D]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? "border-[#E0A93B] text-[#0B4A90] font-bold"
                    : "border-transparent text-[#0F1B2D] hover:border-[#DDD8CE] hover:text-[#0B4A90]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones: Búsqueda, Botón Lista de Precios, WhatsApp, YouTube, Facebook, Instagram */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Input de Búsqueda */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                id="busqueda-d"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Buscar productos…"
                className="w-[150px] lg:w-[170px] xl:w-[190px] h-11 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#0B4A90] focus:bg-white rounded-lg pl-9 pr-3 text-[14px] text-[#0F1B2D] placeholder-[#8A96A5] outline-hidden transition-all"
              />
              <Search className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
            </div>

            {/* Dropdown de Búsqueda en vivo */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#DDD8CE] max-h-[360px] overflow-y-auto z-50 p-2 w-[280px] xl:w-[320px]">
                <div className="text-[11px] font-semibold text-[#8A96A5] uppercase tracking-wider px-3 py-1.5 border-b border-[#F0ECE1]">
                  Resultados encontrados ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromSearch(item)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F7F5F0] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-heading font-bold text-[#0B4A90] text-base group-hover:text-[#E0A93B] transition-colors">
                        {item.num}. {item.name}
                      </div>
                      <div className="text-xs text-[#5A6472] line-clamp-1">{item.shortDesc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A96A5] group-hover:translate-x-1 group-hover:text-[#0B4A90] transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón Lista de Precios al lado de la búsqueda */}
          <Link
            href="/lista-de-precios"
            className="h-11 px-3.5 sm:px-4 rounded-lg bg-[#0B4A90] hover:bg-[#073568] text-white font-semibold text-[13px] sm:text-[14px] flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#E0A93B]" />
            <span className="whitespace-nowrap">Lista de precios</span>
          </Link>

          {/* Botón Red Social YouTube */}
          <a
            href={COMPANY_DATA.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FEDAR en YouTube"
            title="YouTube"
            className="hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#FF0000] hover:opacity-90 transition-transform hover:scale-105 items-center justify-center shrink-0 shadow-xs text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          {/* Botón Red Social Facebook */}
          <a
            href={COMPANY_DATA.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FEDAR en Facebook"
            title="Facebook"
            className="hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:opacity-90 transition-transform hover:scale-105 items-center justify-center shrink-0 shadow-xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          {/* Botón Red Social Instagram */}
          <a
            href={COMPANY_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FEDAR en Instagram"
            title="Instagram"
            className="hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#C1356B] hover:opacity-90 transition-transform hover:scale-105 items-center justify-center shrink-0 shadow-xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <path d="M17.5 6.5h.01" />
            </svg>
          </a>

          {/* Botón Menú Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0B4A90] hover:bg-[#F3F1EC] transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Drawer Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DDD8CE] bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-2">
          {/* Input de Búsqueda Móvil */}
          <div className="relative mb-5">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos en el catálogo…"
              className="w-full h-11 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#0B4A90] rounded-lg pl-9 pr-3 text-[15px] outline-hidden"
            />
            <Search className="w-4 h-4 text-[#8A96A5] absolute left-3 top-3.5" />

            {/* Resultados móviles */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-[#FAF9F6] border border-[#DDD8CE] rounded-lg p-2 max-h-[220px] overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSelectFromSearch(item);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-white rounded text-sm text-[#0B4A90] font-medium flex justify-between items-center"
                  >
                    <span>
                      {item.num}. {item.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navegación Móvil */}
          <div className="flex flex-col gap-2 text-base font-medium text-[#0F1B2D]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    active
                      ? "bg-[#F7F5F0] text-[#0B4A90] font-bold"
                      : "text-[#0F1B2D] hover:bg-[#F7F5F0]"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-[#E0A93B]"></span>}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-[#DDD8CE] flex flex-col gap-3">
            <Link
              href="/lista-de-precios"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-lg bg-[#0B4A90] text-white font-bold text-center flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#E0A93B]" />
              <span>Ver Lista de Precios Mayorista</span>
            </Link>

            <div className="flex gap-3 justify-center pt-2">
              <a
                href={COMPANY_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white"
                aria-label="WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.12c-.24.68-1.2 1.27-1.95 1.36-.51.06-1.18.1-3.43-.84-2.87-1.2-4.73-4.13-4.87-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.19-.15.31-.29.48-.15.17-.31.38-.45.51-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.19-.21.79-.92 1-1.24.21-.31.42-.26.71-.15.29.1 1.84.87 2.16 1.02.31.16.53.24.61.37.07.13.07.78-.17 1.46z" />
                </svg>
              </a>
              <a
                href={COMPANY_DATA.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href={COMPANY_DATA.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={COMPANY_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#C1356B] flex items-center justify-center text-white"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
