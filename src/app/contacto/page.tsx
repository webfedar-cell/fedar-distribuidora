"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Truck,
  Send,
  CheckCircle,
  Building,
  User,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react";
import { COMPANY_DATA } from "@/data/products";

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("Lista de precios mayorista");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsappSend = () => {
    const text = `Hola FEDAR! Me contacto desde la web.\nNombre: ${name || "-"}\nComercio: ${businessName || "-"}\nLocalidad: ${location || "-"}\nInterés: ${interest}\nMensaje: ${message || "Quisiera más información sobre sus productos y condiciones comerciales."}`;
    const url = `https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(text)}`;
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
            <span className="text-[#E0A93B] font-semibold">Contacto</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184677] border border-[#3B6490] text-[#E0A93B] text-xs font-semibold uppercase tracking-wider w-fit">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Atención Comercial y Envíos</span>
              </div>
              <h1 className="font-heading font-extrabold text-[36px] sm:text-[48px] lg:text-[54px] uppercase tracking-tight leading-[1.05]">
                Contacto & Despachos
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#C9D6E3] leading-relaxed">
                Estamos a tu disposición para asesorarte, coordinar la visita de un corredor en tu zona o despachar tus pedidos a cualquier punto del país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 sm:py-16 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Formulario de Consulta (7 columnas) */}
          <div className="lg:col-span-7 bg-white border border-[#DDD8CE] rounded-3xl p-6 sm:p-10 shadow-sm">
            {!submitted ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase leading-tight">
                    Envianos tu Consulta Comercial
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A6472] mt-1">
                    Respondemos en el día hábil a comercios y profesionales.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Martín Rodríguez"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Comercio / Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ej: Ferretería Industrial Norte"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: 11 4880-6934"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
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
                        placeholder="Ej: Mar del Plata, Bs. As."
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Email (Opcional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contacto@ferreteria.com"
                        className="h-12 px-4 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Motivo de Consulta
                      </label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="h-12 px-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all"
                      >
                        <option>Lista de precios mayorista</option>
                        <option>Instalación de gavetero en mostrador</option>
                        <option>Visita de corredor en mi comercio</option>
                        <option>Cotización por volumen / bulto cerrado</option>
                        <option>Envíos al interior / Expreso</option>
                        <option>Otro motivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Mensaje o Detalle del Pedido
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribí aquí tus dudas, productos de interés o medidas que necesitás consultar…"
                      className="p-3.5 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-xl text-sm text-[#0F1B2D] outline-hidden transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-13 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#E0A93B]" />
                      <span>Enviar Mensaje</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsappSend}
                      className="flex-1 h-13 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar por WhatsApp</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center gap-5 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#1F8F4E]/20 text-[#1F8F4E] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-extrabold text-3xl text-[#12355B] uppercase">
                    ¡Mensaje Enviado con Éxito!
                  </h3>
                  <p className="text-sm text-[#5A6472] max-w-md">
                    Gracias <strong>{name}</strong> de <strong>{businessName}</strong>. Un asesor comercial de FEDAR se pondrá en contacto a la brevedad con tu cotización o información solicitada.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-3">
                  <button
                    onClick={handleWhatsappSend}
                    className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Abrir en WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="flex-1 h-12 rounded-xl border border-[#DDD8CE] hover:bg-[#FAF9F6] text-[#0F1B2D] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Información de Contacto Directo & Logística (5 columnas) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Canales Directos */}
            <div className="bg-white border border-[#DDD8CE] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="font-heading font-extrabold text-xl text-[#0F1B2D] uppercase border-b border-[#F0ECE1] pb-3">
                Canales de Atención
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <a
                  href={`tel:${COMPANY_DATA.phoneRaw}`}
                  className="flex items-center gap-3.5 text-[#0F1B2D] hover:text-[#12355B] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E0A93B]/40 text-[#8A5F12] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A96A5] font-semibold uppercase">Teléfono / Fax</div>
                    <div className="font-bold text-base">{COMPANY_DATA.phone}</div>
                  </div>
                </a>

                <a
                  href={COMPANY_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 text-[#0F1B2D] hover:text-[#1F8F4E] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#1F8F4E] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A96A5] font-semibold uppercase">WhatsApp Oficial</div>
                    <div className="font-bold text-base">{COMPANY_DATA.whatsapp}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_DATA.email}`}
                  className="flex items-center gap-3.5 text-[#0F1B2D] hover:text-[#12355B] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#DDD8CE] text-[#12355B] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A96A5] font-semibold uppercase">Correo Electrónico</div>
                    <div className="font-bold text-sm">{COMPANY_DATA.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-2 rounded-xl bg-[#FAF9F6]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#DDD8CE] text-[#8A5F12] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A96A5] font-semibold uppercase">Horario de Atención</div>
                    <div className="font-semibold text-sm text-[#0F1B2D]">{COMPANY_DATA.hours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Logística y Envíos */}
            <div className="bg-[#0A1F36] text-white rounded-3xl p-6 sm:p-8 flex flex-col gap-4 border border-[#142C4B]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-extrabold text-xl uppercase text-white">
                  Despachos a Todo el País
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#C9D6E3] leading-relaxed">
                Entregamos tu pedido sin cargo de flete local en las terminales de transporte y expresos situados en Capital Federal y Gran Buenos Aires (Villa Soldati, Pompeya, Parque Patricios, Retiro).
              </p>

              <div className="pt-2 border-t border-[#1C3656] flex flex-col gap-2 text-xs text-[#A5BCD4]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B]" />
                  <span>Embalaje reforzado para transporte de larga distancia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#E0A93B]" />
                  <span>Despacho ágil en 24 a 48 hs hábiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
