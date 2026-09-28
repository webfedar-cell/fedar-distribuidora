"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Images,
  Users,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Server,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    slidesCount: 0,
    usersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prodRes, slideRes, userRes] = await Promise.all([
          fetch("/api/admin/products?limit=1"),
          fetch("/api/admin/slides"),
          fetch("/api/admin/users"),
        ]);

        const prodData = await prodRes.json();
        const slideData = await slideRes.json();
        const userData = await userRes.json();

        setStats({
          productsCount: prodData.pagination?.total || 0,
          slidesCount: slideData.slides?.length || 0,
          usersCount: userData.users?.length || 0,
        });
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A1F36] via-[#12355B] to-[#1D4A7A] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0A93B]/20 text-[#E0A93B] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel de Administración FEDAR</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            Gestión Centralizada
          </h1>
          <p className="text-sm text-[#C9D6E3] mt-2 leading-relaxed">
            Administrá el catálogo de productos, las imágenes de la portada y los accesos de administradores de la distribuidora.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/admin/productos"
            className="px-4 py-2.5 rounded-xl bg-[#E0A93B] hover:bg-[#C9932B] text-[#0A1F36] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </Link>
          <Link
            href="/admin/slides"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
          >
            <Images className="w-4 h-4" />
            <span>Gestionar Slides</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Card Productos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDD8CE] flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#12355B]/10 text-[#12355B] flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <Link
              href="/admin/productos"
              className="p-2 text-[#8A96A5] hover:text-[#12355B] rounded-lg hover:bg-[#FAF9F6] transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-[#5A6472] font-bold">
              Total Catálogo
            </div>
            <div className="text-3xl font-heading font-extrabold text-[#0F1B2D] mt-1">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#12355B]" /> : stats.productsCount}
            </div>
            <div className="text-xs text-[#8A96A5] mt-1 font-medium">
              Productos registrados en base de datos
            </div>
          </div>
        </div>

        {/* Card Slides */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDD8CE] flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#E0A93B]/20 text-[#A27218] flex items-center justify-center">
              <Images className="w-6 h-6" />
            </div>
            <Link
              href="/admin/slides"
              className="p-2 text-[#8A96A5] hover:text-[#12355B] rounded-lg hover:bg-[#FAF9F6] transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-[#5A6472] font-bold">
              Slides / Portada
            </div>
            <div className="text-3xl font-heading font-extrabold text-[#0F1B2D] mt-1">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#E0A93B]" /> : stats.slidesCount}
            </div>
            <div className="text-xs text-[#8A96A5] mt-1 font-medium">
              Banners y slides en la página principal
            </div>
          </div>
        </div>

        {/* Card Usuarios */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDD8CE] flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <Link
              href="/admin/usuarios"
              className="p-2 text-[#8A96A5] hover:text-[#12355B] rounded-lg hover:bg-[#FAF9F6] transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-[#5A6472] font-bold">
              Administradores
            </div>
            <div className="text-3xl font-heading font-extrabold text-[#0F1B2D] mt-1">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> : stats.usersCount}
            </div>
            <div className="text-xs text-[#8A96A5] mt-1 font-medium">
              Cuentas con acceso al panel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sección 1: Productos */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD8CE] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A1F36] text-white flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0F1B2D]">
                Catálogo de Productos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6472] leading-relaxed mb-4">
              Crea nuevos artículos, actualiza títulos, descripciones, categorías, precios y fotos principales.
            </p>
          </div>
          <Link
            href="/admin/productos"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white border border-[#DDD8CE] text-[#0F1B2D] font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
          >
            <span>Ir a Productos</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sección 2: Slides */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD8CE] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0A93B] text-[#0A1F36] flex items-center justify-center">
                <Images className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0F1B2D]">
                Slides de Portada
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6472] leading-relaxed mb-4">
              Configura las imágenes destacadas del carrusel de inicio, orden de visualización y estados de publicación.
            </p>
          </div>
          <Link
            href="/admin/slides"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white border border-[#DDD8CE] text-[#0F1B2D] font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
          >
            <span>Ir a Slides</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sección 3: Usuarios */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD8CE] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#0F1B2D]">
                Usuarios y Accesos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6472] leading-relaxed mb-4">
              Crea nuevos usuarios administradores, modifica correos y actualiza contraseñas de forma segura.
            </p>
          </div>
          <Link
            href="/admin/usuarios"
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white border border-[#DDD8CE] text-[#0F1B2D] font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
          >
            <span>Ir a Usuarios</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
