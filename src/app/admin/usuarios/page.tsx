"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  ShieldCheck,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserItem {
  US_ID: number;
  US_NOMBRE: string;
  US_ACCESO: number;
  NI_DENOMINACION?: string;
}

interface LevelItem {
  NI_ID: number;
  NI_DENOMINACION: string;
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    acceso: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Delete Confirmation State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setLevels(data.levels || []);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ email: "", password: "", acceso: 1 });
    setActionError("");
    setActionSuccess("");
    setShowPassword(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({ email: user.US_NOMBRE, password: "", acceso: user.US_ACCESO });
    setActionError("");
    setActionSuccess("");
    setShowPassword(false);
    setModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!formData.email) {
      setActionError("El correo electrónico es requerido.");
      return;
    }

    if (!editingUser && !formData.password) {
      setActionError("Debe ingresar una contraseña para el nuevo usuario.");
      return;
    }

    setSaving(true);
    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.US_ID}`
        : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Error al guardar el usuario.");
      } else {
        setActionSuccess(
          editingUser
            ? "Usuario actualizado correctamente."
            : "Usuario creado exitosamente."
        );
        setTimeout(() => {
          setModalOpen(false);
          loadUsers();
        }, 1000);
      }
    } catch (err: any) {
      setActionError("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteConfirmUser.US_ID}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Error al eliminar usuario.");
      } else {
        setDeleteConfirmUser(null);
        loadUsers();
      }
    } catch (err) {
      alert("Error al eliminar usuario.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.US_NOMBRE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase tracking-tight">
            Usuarios del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6472] mt-1">
            Administración de cuentas con acceso al panel de control de FEDAR.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDD8CE] shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por correo o usuario..."
            className="w-full h-11 pl-10 pr-4 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-[#8A96A5] absolute left-3.5 top-3.5" />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="px-3 py-2 text-xs font-semibold text-[#5A6472] hover:text-[#0F1B2D]"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#DDD8CE] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#12355B]" />
            <span className="text-sm font-semibold text-[#5A6472]">
              Cargando usuarios...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-[#5A6472] text-sm">
            No se encontraron usuarios administradores.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F1B2D]">
              <thead className="bg-[#0A1F36] text-[#C9D6E3] text-xs uppercase font-heading tracking-wider border-b border-[#142C4B]">
                <tr>
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-5">Usuario / Correo Electrónico</th>
                  <th className="py-3.5 px-5">Nivel de Acceso</th>
                  <th className="py-3.5 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DB]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.US_ID}
                    className="hover:bg-[#FAF9F6] transition-colors"
                  >
                    <td className="py-4 px-5 font-mono text-xs text-[#8A96A5]">
                      #{user.US_ID}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#12355B]/10 text-[#12355B] flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#0F1B2D]">
                          {user.US_NOMBRE}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{user.NI_DENOMINACION || (user.US_ACCESO === 1 ? "Admin" : "Usuario")}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white text-[#5A6472] transition-colors cursor-pointer border border-[#DDD8CE]"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(user)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer border border-rose-200"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#DDD8CE] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-[#0A1F36] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white uppercase">
                    {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                  </h3>
                  <div className="text-xs text-[#A5BCD4]">
                    {editingUser
                      ? `Modificando ID #${editingUser.US_ID}`
                      : "Creación de cuenta de administrador"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-6 flex flex-col gap-4">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Correo Electrónico / Usuario
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="admin@fedardistribuidora.com.ar"
                    className="w-full h-11 pl-9 pr-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  {editingUser
                    ? "Nueva Contraseña (dejar en blanco para mantener)"
                    : "Contraseña"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full h-11 pl-9 pr-10 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-[#8A96A5] absolute left-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#8A96A5] hover:text-[#0F1B2D] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Nivel de Acceso
                </label>
                <select
                  value={formData.acceso}
                  onChange={(e) =>
                    setFormData({ ...formData, acceso: Number(e.target.value) })
                  }
                  className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                >
                  <option value={1}>1 - Administrador Total</option>
                  <option value={0}>0 - Estándar</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#EAE5DB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#5A6472] hover:text-[#0F1B2D] rounded-xl hover:bg-[#FAF9F6] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-70 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Usuario</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#DDD8CE] flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#0F1B2D]">
                ¿Eliminar Usuario?
              </h3>
              <p className="text-xs text-[#5A6472] mt-1">
                Se eliminará el acceso para <strong>{deleteConfirmUser.US_NOMBRE}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDD8CE] text-xs font-bold text-[#5A6472] hover:bg-[#FAF9F6]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Eliminar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
