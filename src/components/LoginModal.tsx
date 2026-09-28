"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = "login" | "recover-request" | "recover-reset" | "recover-success";

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // Navigation & States
  const [view, setView] = useState<ModalView>("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Recovery Form
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setView("login");
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(false);
    setShowPassword(false);
    setShowNewPassword(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // 1. Manejo del Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Usuario o contraseña incorrectos.");
      } else {
        setLoggedInUser(data.user?.email || email);
        setSuccessMsg(`¡Bienvenido/a, ${data.user?.email}! Redirigiendo al Panel de Administración...`);
        setTimeout(() => {
          window.location.href = "/admin";
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg("Error de conexión. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Solicitar Código de Recuperación
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "No se encontró el correo ingresado.");
      } else {
        if (data.code) {
          setRecoveryCode(data.code);
        }
        setSuccessMsg(
          data.emailSent
            ? "Hemos enviado el código de verificación a tu casilla de correo."
            : "Código de recuperación generado correctamente."
        );
        setView("recover-reset");
      }
    } catch (err: any) {
      setErrorMsg("Error al comunicarse con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Confirmar y Restablecer Nueva Contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden. Verifíquelas e intente nuevamente.");
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg("La nueva contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recoveryEmail,
          code: recoveryCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Error al restablecer la contraseña.");
      } else {
        setSuccessMsg(data.message || "Contraseña restablecida con éxito.");
        setView("recover-success");
      }
    } catch (err: any) {
      setErrorMsg("Error al comunicarse con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#DDD8CE] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A1F36] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
              {view === "login" ? (
                <Lock className="w-5 h-5" />
              ) : (
                <KeyRound className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#A5BCD4] font-bold">
                Acceso Exclusivo • Administrador
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white uppercase leading-tight">
                {view === "login"
                  ? "Ingreso al Sistema"
                  : view === "recover-success"
                  ? "Contraseña Actualizada"
                  : "Recuperar Contraseña"}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Mensajes de Error y Éxito */}
          {errorMsg && (
            <div className="p-3 bg-[#FFF3CD] border border-[#FFE69C] rounded-xl text-xs sm:text-sm text-[#856404] flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#856404]" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && view !== "recover-success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* VISTA 1: LOGIN */}
          {view === "login" && (
            <>
              {loggedInUser ? (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="font-bold text-lg text-[#0F1B2D]">
                    Sesión iniciada
                  </div>
                  <p className="text-sm text-[#5A6472]">
                    Has ingresado como <span className="font-semibold text-[#12355B]">{loggedInUser}</span>.
                  </p>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                      onClick={() => {
                        window.location.href = "/admin";
                      }}
                      className="w-full h-11 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <span>Ir al Panel de Administración →</span>
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        setLoggedInUser(null);
                        setSuccessMsg("");
                        setPassword("");
                      }}
                      className="px-5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Usuario / Correo Electrónico
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@ejemplo.com"
                        className="w-full h-11 pl-9 pr-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                      <Mail className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                        Contraseña
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg("");
                          setSuccessMsg("");
                          setRecoveryEmail(email);
                          setView("recover-request");
                        }}
                        className="text-xs text-[#12355B] hover:text-[#E0A93B] font-medium transition-colors cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-9 pr-10 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] outline-hidden transition-all"
                      />
                      <KeyRound className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-[#8A96A5] hover:text-[#0F1B2D] transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 mt-2 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verificando credenciales...</span>
                      </>
                    ) : (
                      <span>Ingresar al Panel</span>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* VISTA 2: SOLICITAR RECUPERACIÓN */}
          {view === "recover-request" && (
            <form onSubmit={handleRequestRecovery} className="flex flex-col gap-4">
              <p className="text-xs sm:text-sm text-[#5A6472] leading-relaxed">
                Ingresá el correo electrónico asociado a tu cuenta de usuario administrador para generar un código de recuperación.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Correo Electrónico Registrado
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="usuario@dominio.com"
                    className="w-full h-11 pl-9 pr-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] outline-hidden transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comprobando usuario...</span>
                    </>
                  ) : (
                    <span>Generar Código de Recuperación</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("login");
                  }}
                  className="h-10 flex items-center justify-center gap-1.5 text-xs text-[#5A6472] hover:text-[#0F1B2D] font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al inicio de sesión</span>
                </button>
              </div>
            </form>
          )}

          {/* VISTA 3: INGRESAR CÓDIGO Y NUEVA CONTRASEÑA */}
          {view === "recover-reset" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
                Ingresá el código de verificación de 6 dígitos y tu nueva contraseña para el usuario <strong>{recoveryEmail}</strong>.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Código de Verificación
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="Ej: 123456"
                    className="w-full h-11 pl-9 pr-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] tracking-widest font-mono outline-hidden transition-all"
                  />
                  <Sparkles className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Nueva Contraseña
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-9 pr-10 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] outline-hidden transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-[#8A96A5] hover:text-[#0F1B2D] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-9 pr-3 bg-[#FAF9F6] border border-[#CFC9BD] focus:border-[#12355B] focus:bg-white rounded-lg text-sm text-[#0F1B2D] outline-hidden transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Actualizando contraseña...</span>
                    </>
                  ) : (
                    <span>Guardar Nueva Contraseña</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setView("recover-request");
                  }}
                  className="h-10 flex items-center justify-center gap-1.5 text-xs text-[#5A6472] hover:text-[#0F1B2D] font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a ingresar correo</span>
                </button>
              </div>
            </form>
          )}

          {/* VISTA 4: ÉXITO EN RESTABLECIMIENTO */}
          {view === "recover-success" && (
            <div className="flex flex-col items-center justify-center py-4 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-[#0F1B2D]">
                ¡Contraseña restablecida!
              </h4>
              <p className="text-xs sm:text-sm text-[#5A6472] max-w-xs leading-relaxed">
                Tu clave ha sido actualizada con éxito en el sistema. Ya podés iniciar sesión con tus nuevas credenciales.
              </p>
              <button
                onClick={() => {
                  resetState();
                  setView("login");
                  setEmail(recoveryEmail);
                }}
                className="mt-3 w-full h-11 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
