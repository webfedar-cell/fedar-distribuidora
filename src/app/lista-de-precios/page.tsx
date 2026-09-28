"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Download,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  Truck,
  Building2,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { COMPANY_DATA, CATEGORIES_LIST } from "@/data/products";

export default function ListaDePreciosPage() {
  const [businessName, setBusinessName] = useState("");
  const [rubro, setRubro] = useState("Ferretería / Bulonera");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDownloadFile = () => {
    const content = `=====================================================
FEDAR DISTRIBUIDORA MAYORISTA
Accesorios para ferreterías, buloneras y repuesteros
Tel/Fax: ${COMPANY_DATA.phone} | WhatsApp: ${COMPANY_DATA.whatsapp}
Email: ${COMPANY_DATA.email}
=====================================================

LISTA DE PRECIOS MAYORISTA VIGENTE
Comercio Solicitante: ${businessName || "Comercio"}
Rubro: ${rubro}
Localidad: ${location || "CABA / Interior"}

LÍNEAS INCLUIDAS EN EL CATÁLOGO OFICIAL:
${CATEGORIES_LIST.map((c) => `[${c.num}] ${c.name.toUpperCase()} - ${c.shortDesc}\n   Artículos: ${c.items.join(", ")}`).join("\n\n")}

CONDICIONES COMERCIALES:
- Venta exclusiva a comercios e industrias del rubro.
- Precios con IVA incluido o Factura A / B según corresponda.
- Despacho sin cargo en expresos y transportes de CABA.
- Reposición periódica por corredor en zonas de cobertura.

Para recibir el archivo Excel detallado con listas de códigos y descuentos especiales por volumen, comuníquese directamente a nuestro WhatsApp oficial: ${COMPANY_DATA.whatsappUrl}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FEDAR_Lista_Precios_${businessName ? businessName.replace(/\s+/g, "_") : "Mayorista"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsappRequest = () => {
    const message = `Hola FEDAR! Solicito la lista de precios mayorista actualizada.\nComercio: ${businessName || "Mi Comercio"}\nRubro: ${rubro}\nLocalidad: ${location || "CABA / Interior"}\nContacto: ${phone || "-"}`;
    const url = `https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header de la Página */}
      <section className="bg-[#0A1F36] text-white py-12 sm:py-16 border-b border-[#142C4B]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5BCD4]">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-[#E0A93B] font-semibold">Lista de precios</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184677] border border-[#3B6490] text-[#E0A93B] text-xs font-semibold uppercase tracking-wider w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Precios Oficiales de Fábrica e Importación</span>
              </div>
              <h1 className="font-heading font-extrabold text-[36px] sm:text-[48px] lg:text-[54px] uppercase tracking-tight leading-[1.05]">
                Lista de Precios Mayorista
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#C9D6E3] leading-relaxed">
                Accedé a los precios actualizados, descuentos por cantidad y condiciones especiales para ferreterías, buloneras, casas de repuestos y talleres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuerpo Principal */}
      <section className="py-12 sm:py-16 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Formulario y Descarga (7 columnas) */}
          <div className="lg:col-span-7 bg-white border border-[#DDD8CE] rounded-3xl p-6 sm:p-10 shadow-sm">
            {!submitted ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#F0ECE1]">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E0A93B]/40 text-[#8A5F12] flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase leading-tight">
                      Solicitar o Descargar Lista
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A6472]">
                      Completá los datos de tu comercio para generar la descarga inmediata.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Nombre del Comercio / Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ej: Bulonera del Centro SRL"
                      className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Rubro Comercial *
                      </label>
                      <select
                        value={rubro}
                        onChange={(e) => setRubro(e.target.value)}
                        className="h-12 px-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      >
                        <option>Ferretería / Bulonera</option>
                        <option>Repuestos Automotor / Motos</option>
                        <option>Electricidad / Taller</option>
                        <option>Distribuidor / Revendedor</option>
                        <option>Industria / Metalúrgica</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Localidad / Provincia *
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Córdoba Capital"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Teléfono / WhatsApp (Opcional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: 11 2345-6789"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Email (Opcional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ventas@comercio.com"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3.5 pt-4">
                    <button
                      type="submit"
                      className="flex-1 h-13 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <Download className="w-4.5 h-4.5 text-[#E0A93B]" />
                      <span>Generar y Descargar Lista</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsappRequest}
                      className="flex-1 h-13 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                      <span>Pedir por WhatsApp</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center gap-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#1F8F4E]/20 text-[#1F8F4E] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-extrabold text-3xl text-[#12355B] uppercase">
                    ¡Lista de Precios Lista!
                  </h3>
                  <p className="text-sm text-[#5A6472] max-w-md">
                    Hemos preparado el archivo con el catálogo y precios mayoristas para{" "}
                    <strong>{businessName || "tu comercio"}</strong> ({rubro}, {location}).
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-md pt-2">
                  <button
                    onClick={handleDownloadFile}
                    className="w-full h-13 rounded-xl bg-[#E0A93B] hover:bg-[#D49E33] text-[#0F1B2D] font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Archivo Ahora</span>
                  </button>

                  <button
                    onClick={handleWhatsappRequest}
                    className="w-full h-13 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>Recibir Copia por WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#5A6472] hover:underline pt-2"
                  >
                    ← Modificar datos o generar otra solicitud
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Información Comercial y Beneficios (5 columnas) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tarjeta de Ventajas Mayoristas */}
            <div className="bg-[#FAF9F6] border border-[#DDD8CE] rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
              <div className="font-heading font-extrabold text-xl text-[#0F1B2D] uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8A5F12]" />
                <span>Condiciones Mayoristas</span>
              </div>

              <div className="flex flex-col gap-4 text-sm text-[#5A6472]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1B2D]">Despacho sin cargo en expresos:</strong> Entregamos en los transportes de Capital Federal (Villa Soldati, Pompeya, etc.) sin costo de flete local.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1B2D]">Reposición por corredor:</strong> Visitas programadas en CABA y Gran Buenos Aires para reponer directamente los gaveteros.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1B2D]">Facturación A y B:</strong> Emitimos comprobantes fiscales oficiales de acuerdo a tu condición de IVA.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1B2D]">Descuentos por volumen:</strong> Escalas de bonificación para compras por bulto cerrado y gaveteros completos.
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Atención Comercial */}
            <div className="bg-[#0A1F36] text-white rounded-3xl p-6 sm:p-8 flex flex-col gap-4 border border-[#142C4B]">
              <div className="font-heading font-extrabold text-lg uppercase text-[#E0A93B]">
                ¿Necesitás asesoramiento inmediato?
              </div>
              <p className="text-xs sm:text-sm text-[#C9D6E3] leading-relaxed">
                Contactate de forma directa con un asesor técnico comercial para armar tu pedido o consultar stock en el acto.
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#1C3656] text-sm">
                <a
                  href={`tel:${COMPANY_DATA.phoneRaw}`}
                  className="flex items-center gap-2 text-white hover:text-[#E0A93B] transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#E0A93B]" />
                  <span>Tel/Fax: {COMPANY_DATA.phone}</span>
                </a>
                <a
                  href={COMPANY_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#25D366] hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: {COMPANY_DATA.whatsapp}</span>
                </a>
                <div className="flex items-center gap-2 text-[#A5BCD4] text-xs pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#E0A93B]" />
                  <span>{COMPANY_DATA.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Líneas Incluidas */}
        <div className="mt-14 pt-10 border-t border-[#DDD8CE]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="font-heading font-semibold text-xs uppercase tracking-widest text-[#8A5F12]">
                Cobertura del Catálogo
              </div>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase">
                Líneas de productos presentes en la lista
              </h3>
            </div>
            <Link
              href="/productos"
              className="text-sm font-bold text-[#12355B] hover:underline flex items-center gap-1"
            >
              <span>Ver fichas en el catálogo web</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES_LIST.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-[#E7E2D8] flex items-center justify-between gap-3 hover:border-[#12355B] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-extrabold text-sm text-[#E0A93B]">
                    {item.num}
                  </span>
                  <span className="text-sm font-semibold text-[#0F1B2D]">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] text-[#8A96A5]">
                  {item.items.length} art.
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
