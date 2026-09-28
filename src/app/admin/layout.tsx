"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Images,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Layers,
  Loader2,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; acceso: number } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar sesión activa
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    }
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/productos",
      label: "Productos",
      icon: Package,
      exact: false,
    },
    {
      href: "/admin/slides",
      label: "Slides / Portada",
      icon: Images,
      exact: false,
    },
    {
      href: "/admin/usuarios",
      label: "Usuarios Admin",
      icon: Users,
      exact: false,
    },
  ];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-xl border border-[#DDD8CE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#12355B]" />
          <span className="text-sm font-semibold text-[#0F1B2D]">
            Cargando Panel de Administración...
          </span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de inicio de sesión requerida
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-[#DDD8CE] overflow-hidden">
          <div className="p-6 bg-[#0A1F36] text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E0A93B]/20 text-[#E0A93B] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-extrabold text-xl uppercase tracking-wider text-white">
              Acceso Restringido
            </h2>
            <p className="text-xs text-[#A5BCD4] mt-1">
              Debés iniciar sesión con una cuenta de administrador para acceder a este panel.
            </p>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full h-12 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Ir al Sitio Web para Iniciar Sesión</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row text-[#0F1B2D]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A1F36] text-white shrink-0 border-r border-[#142C4B] z-20">
        {/* Logo / Header */}
        <div className="p-5 border-b border-[#142C4B] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E0A93B] text-[#0A1F36] flex items-center justify-center font-extrabold font-heading text-lg shadow-sm">
            F
          </div>
          <div>
            <div className="font-heading font-extrabold text-base tracking-wider text-white uppercase leading-none">
              FEDAR
            </div>
            <div className="text-[11px] text-[#E0A93B] font-bold tracking-wider uppercase mt-1">
              Panel Admin
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#12355B] text-white shadow-xs border-l-4 border-[#E0A93B]"
                    : "text-[#A5BCD4] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#E0A93B]" : "text-[#A5BCD4]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-[#142C4B] bg-[#071626]/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#12355B] text-[#E0A93B] flex items-center justify-center text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {user.email}
              </div>
              <div className="text-[10px] text-[#8A96A5] uppercase font-bold">
                Administrador
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#C9D6E3] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E0A93B]" />
              <span>Ver Web</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 max-w-[80vw] h-full bg-[#0A1F36] text-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#142C4B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E0A93B] text-[#0A1F36] flex items-center justify-center font-extrabold font-heading text-base">
                  F
                </div>
                <div>
                  <div className="font-heading font-extrabold text-sm tracking-wider text-white uppercase">
                    FEDAR ADMIN
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#12355B] text-white shadow-xs border-l-4 border-[#E0A93B]"
                        : "text-[#A5BCD4] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#E0A93B]" : "text-[#A5BCD4]"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#142C4B] bg-[#071626]/50 flex flex-col gap-3">
              <div className="text-xs font-semibold text-white truncate">
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white/5 text-xs text-[#C9D6E3]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#E0A93B]" />
                  <span>Ver Web</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 text-rose-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile */}
        <header className="h-16 bg-white border-b border-[#DDD8CE] px-4 sm:px-6 flex items-center justify-between md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#DDD8CE] flex items-center justify-center text-[#0F1B2D]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-extrabold text-base text-[#0A1F36] uppercase">
              FEDAR Admin
            </span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs font-semibold text-[#12355B] bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#DDD8CE]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E0A93B]" />
            <span>Web</span>
          </Link>
        </header>

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
