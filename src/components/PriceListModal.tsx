"use client";

import React, { useState } from "react";
import { X, FileSpreadsheet, Download, MessageSquare, CheckCircle, Store, MapPin } from "lucide-react";
import { COMPANY_DATA } from "@/data/products";

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceListModal: React.FC<PriceListModalProps> = ({ isOpen, onClose }) => {
  const [businessName, setBusinessName] = useState("");
  const [rubro, setRubro] = useState("Ferretería / Bulonera");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsappRequest = () => {
    const message = `Hola FEDAR! Solicito la lista de precios mayorista actualizada.\nComercio: ${businessName || "Mi Comercio"}\nRubro: ${rubro}\nLocalidad: ${location || "CABA / Interior"}`;
    const url = `https://wa.me/${COMPANY_DATA.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DDD8CE] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-[#0A1F36] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#A5BCD4] font-semibold">
                Lista Mayorista Oficial
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase leading-tight">
                Lista de Precios FEDAR
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 flex flex-col gap-6">
          {!submitted ? (
            <>
              <p className="text-sm text-[#5A6472] leading-relaxed">
                Venta mayorista exclusiva para ferreterías, buloneras, repuesteras y talleres.
                Completá los datos para descargar o recibir la lista en tu WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                    Nombre del Comercio / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej: Bulonera San Martín"
                    className="h-11 px-3.5 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-lg text-sm text-[#0F1B2D] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Rubro
                    </label>
                    <select
                      value={rubro}
                      onChange={(e) => setRubro(e.target.value)}
                      className="h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-lg text-sm text-[#0F1B2D] outline-hidden"
                    >
                      <option>Ferretería / Bulonera</option>
                      <option>Repuestos Automotor / Motos</option>
                      <option>Electricidad / Taller</option>
                      <option>Distribuidor / Revendedor</option>
                      <option>Industria</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Localidad / Provincia
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej: Rosario, Santa Fe"
                      className="h-11 px-3.5 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] rounded-lg text-sm text-[#0F1B2D] outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsappRequest}
                    className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Pedir por WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#E0A93B]" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center gap-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-[#1F8F4E]/20 text-[#1F8F4E] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-heading font-extrabold text-2xl text-[#12355B] uppercase">
                  ¡Lista Generada con Éxito!
                </h4>
                <p className="text-sm text-[#5A6472] max-w-sm">
                  Hemos preparado la lista de precios para <strong>{businessName || "tu comercio"}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full pt-2">
                <button
                  onClick={() => {
                    // Simular descarga de archivo PDF
                    const element = document.createElement("a");
                    const file = new Blob([
                      `FEDAR DISTRIBUIDORA MAYORISTA\nLista de Precios Vigente\nComercio: ${businessName}\nRubro: ${rubro}\nTel: (011) 4880-6934\nWhatsApp: 11 2874-3375\n\nConsulte por gaveteros y condiciones comerciales.`
                    ], { type: "text/plain" });
                    element.href = URL.createObjectURL(file);
                    element.download = "FEDAR_Lista_Precios_Mayorista.txt";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="w-full h-12 rounded-xl bg-[#E0A93B] hover:bg-[#D49E33] text-[#0F1B2D] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo Ahora</span>
                </button>

                <button
                  onClick={handleWhatsappRequest}
                  className="w-full h-12 rounded-xl border border-[#DDD8CE] hover:bg-[#FAF9F6] text-[#0F1B2D] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Enviar copia a mi WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
