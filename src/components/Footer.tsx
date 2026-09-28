"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, Mail, MapPin, ArrowUp } from "lucide-react";
import { COMPANY_DATA } from "@/data/products";
import { useModals } from "@/context/ModalContext";
import { Logo } from "@/components/Logo";

interface FooterProps {
  onOpenPriceListModal?: () => void;
  onOpenLoginModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPriceListModal,
  onOpenLoginModal,
}) => {
  const modals = useModals();

  const handleOpenPriceList = onOpenPriceListModal || modals.openPriceListModal;
  const handleOpenLogin = onOpenLoginModal || modals.openLoginModal;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contacto"
      className="bg-[#0F1B2D] text-[#AFC0D2] pt-14 sm:pt-16 pb-10 border-t border-[#1C2C42]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 flex flex-col gap-12">
        {/* Grilla Principal del Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Columna 1: Marca & Redes */}
          <div className="flex flex-col gap-3.5">
            <Link href="/" className="hover:opacity-95 transition-opacity">
              <Logo variant="white" />
            </Link>
            <p className="text-[14px] sm:text-[15px] leading-[1.5] text-[#8EA3B8] max-w-[280px]">
              {COMPANY_DATA.slogan}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {/* WhatsApp */}
              <a
                href={COMPANY_DATA.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEDAR en WhatsApp"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center text-white shadow-md"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.12c-.24.68-1.2 1.27-1.95 1.36-.51.06-1.18.1-3.43-.84-2.87-1.2-4.73-4.13-4.87-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.19-.15.31-.29.48-.15.17-.31.38-.45.51-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.19-.21.79-.92 1-1.24.21-.31.42-.26.71-.15.29.1 1.84.87 2.16 1.02.31.16.53.24.61.37.07.13.07.78-.17 1.46z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={COMPANY_DATA.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEDAR en YouTube"
                className="w-10 h-10 rounded-full bg-[#FF0000] hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center text-white shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={COMPANY_DATA.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEDAR en Facebook"
                className="w-10 h-10 rounded-full bg-[#1877F2] hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center text-white shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={COMPANY_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEDAR en Instagram"
                className="w-10 h-10 rounded-full bg-[#C1356B] hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center text-white shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Productos */}
          <div className="flex flex-col gap-2.5 text-[14px] sm:text-[15px]">
            <div className="font-semibold text-white mb-1.5 uppercase tracking-wider text-xs font-heading">
              Líneas de Productos
            </div>
            <Link href="/productos" className="hover:text-white transition-colors">
              Terminales y Punteras
            </Link>
            <Link href="/productos" className="hover:text-white transition-colors">
              Conectores y Borneras
            </Link>
            <Link href="/productos" className="hover:text-white transition-colors">
              Orings y Retenes
            </Link>
            <Link href="/productos" className="hover:text-white transition-colors">
              Abrazaderas y Fijaciones
            </Link>
            <Link href="/productos" className="hover:text-white transition-colors">
              Gaveteros y Módulos Armados
            </Link>
            <Link
              href="/productos"
              className="text-[#E0A93B] hover:underline font-medium pt-1 inline-flex items-center gap-1"
            >
              <span>Ver catálogo completo</span> →
            </Link>
          </div>

          {/* Columna 3: Empresa */}
          <div className="flex flex-col gap-2.5 text-[14px] sm:text-[15px]">
            <div className="font-semibold text-white mb-1.5 uppercase tracking-wider text-xs font-heading">
              Empresa y Servicios
            </div>
            <Link href="/nosotros" className="hover:text-white transition-colors">
              Quiénes Somos
            </Link>
            <Link href="/nosotros" className="hover:text-white transition-colors">
              Cómo Trabajamos (Sistema Gaveteros)
            </Link>
            <Link href="/lista-de-precios" className="hover:text-white transition-colors">
              Lista de Precios Mayorista
            </Link>
            <Link href="/contacto" className="hover:text-white transition-colors">
              Contacto y Envíos al Interior
            </Link>
            <button
              onClick={handleOpenLogin}
              className="text-left hover:text-[#E0A93B] transition-colors cursor-pointer pt-1"
            >
              Acceso Administrador →
            </button>
          </div>

          {/* Columna 4: Contacto */}
          <div className="flex flex-col gap-3 text-[14px] sm:text-[15px]">
            <div className="font-semibold text-white mb-1 uppercase tracking-wider text-xs font-heading">
              Atención Comercial
            </div>
            <a
              href={`tel:${COMPANY_DATA.phoneRaw}`}
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E0A93B]" />
              <span>Tel/Fax {COMPANY_DATA.phone}</span>
            </a>
            <a
              href={COMPANY_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>WhatsApp {COMPANY_DATA.whatsapp}</span>
            </a>
            <a
              href={`mailto:${COMPANY_DATA.email}`}
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#E0A93B] shrink-0" />
              <span>{COMPANY_DATA.email}</span>
            </a>
            <Link href="/contacto" className="flex items-start gap-2.5 text-[#8EA3B8] hover:text-white transition-colors">
              <MapPin className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
              <span>Buenos Aires · Despachos a todo el país</span>
            </Link>
          </div>
        </div>

        {/* Barra Inferior de Copyright */}
        <div className="border-t border-[#25364C] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] text-[#8497AC]">
          <div>
            © {new Date().getFullYear()} FEDAR Distribuidora · fedardistribuidora.com.ar · Todos los derechos reservados.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#AFC0D2] hover:text-[#E0A93B] transition-colors cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
