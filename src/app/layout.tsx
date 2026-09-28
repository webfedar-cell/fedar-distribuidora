import type { Metadata } from "next";
import { Archivo, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FEDAR — Distribuidora Mayorista | Accesorios para ferreterías, buloneras y repuesteros",
  description:
    "Distribuidora mayorista de accesorios, terminales, orings, abrazaderas, bulonería y repuestos. Sistema de gaveteros para mostrador, reposición periódica por corredor y envíos a todo el país.",
  keywords: [
    "FEDAR distribuidora",
    "gaveteros mostrador",
    "terminales eléctricas",
    "accesorios ferretería",
    "bulonería",
    "repuesteros",
    "orings",
    "abrazaderas",
    "mayorista ferretería",
    "lista de precios mayorista",
  ],
  authors: [{ name: "FEDAR Distribuidora" }],
  openGraph: {
    title: "FEDAR Distribuidora Mayorista",
    description:
      "Accesorios, terminales y repuestos para tu mostrador. Gaveteros armados con stock de alta rotación.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${barlowCondensed.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#0F1B2D] bg-[#F3F1EC] min-h-screen selection:bg-[#E0A93B] selection:text-[#0F1B2D] flex flex-col">
        <ModalProvider>
          {/* 1. Barra superior de contacto */}
          <TopBar />

          {/* 2. Barra de Navegación Principal */}
          <Navbar />

          {/* 3. Contenido Principal de cada página */}
          <main className="flex-1">
            {children}
          </main>

          {/* 4. Footer General */}
          <Footer />

          {/* 5. Botón Flotante de WhatsApp */}
          <WhatsAppFloat />
        </ModalProvider>
      </body>
    </html>
  );
}
