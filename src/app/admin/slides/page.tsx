"use client";

import React, { useState, useEffect } from "react";
import {
  Images,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles,
  Upload,
  Link2,
} from "lucide-react";

interface SlideItem {
  PO_ID: number;
  PO_ARCHIVO: string;
  PO_TITULO: string;
  PO_DESCRIPCION: string;
  PO_IDPRODUCTO: number;
  PO_ORDENAR: number;
  PO_STATUS: number;
  PRODUCTO_TITULO?: string;
}

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);
  const [formData, setFormData] = useState({
    archivo: "",
    titulo: "",
    descripcion: "",
    idProducto: 0,
    ordenar: 1,
    status: 1,
  });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Delete State
  const [deleteConfirmSlide, setDeleteConfirmSlide] = useState<SlideItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Upload & Preview State
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const photosBaseUrl =
    process.env.NEXT_PUBLIC_PORTADA_URL || "https://fedardistribuidora.com.ar/portada/";

  const getDisplaySlideUrl = (fileName?: string | null) => {
    if (!fileName) return null;
    const trimmed = fileName.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
    return `/portada/${encodeURIComponent(trimmed)}`;
  };

  const loadSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/slides");
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides || []);
      }
    } catch (err) {
      console.error("Error al cargar slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setFormData({
      archivo: "",
      titulo: "",
      descripcion: "",
      idProducto: 0,
      ordenar: (slides.length + 1) * 10,
      status: 1,
    });
    setPreviewUrl(null);
    setShowManualUrl(false);
    setActionError("");
    setActionSuccess("");
    setModalOpen(true);
  };

  const handleOpenEdit = (slide: SlideItem) => {
    setEditingSlide(slide);
    setFormData({
      archivo: slide.PO_ARCHIVO,
      titulo: slide.PO_TITULO,
      descripcion: slide.PO_DESCRIPCION,
      idProducto: slide.PO_IDPRODUCTO,
      ordenar: slide.PO_ORDENAR,
      status: slide.PO_STATUS,
    });
    setPreviewUrl(slide.PO_ARCHIVO ? getDisplaySlideUrl(slide.PO_ARCHIVO) : null);
    setShowManualUrl(false);
    setActionError("");
    setActionSuccess("");
    setModalOpen(true);
  };

  const processSlideFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setActionError("Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).");
      return;
    }

    setUploadingSlide(true);
    setActionError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "portada");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.message || "Error al subir la imagen del banner.");
      } else {
        setFormData((prev) => ({
          ...prev,
          archivo: data.filename || data.url,
        }));
        setPreviewUrl(data.url);
      }
    } catch (err) {
      console.error("Error al subir archivo de portada:", err);
      setActionError("Error de comunicación al subir la imagen.");
    } finally {
      setUploadingSlide(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await processSlideFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processSlideFile(e.dataTransfer.files[0]);
    }
  };

  const handleToggleStatus = async (slide: SlideItem) => {
    try {
      const newStatus = slide.PO_STATUS === 1 ? 0 : 1;
      await fetch(`/api/admin/slides/${slide.PO_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...slide,
          status: newStatus,
        }),
      });
      loadSlides();
    } catch (e) {
      console.error("Error al cambiar estado:", e);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!formData.archivo && !formData.titulo) {
      setActionError("Debe ingresar al menos un archivo de imagen o un título.");
      return;
    }

    setSaving(true);
    try {
      const url = editingSlide
        ? `/api/admin/slides/${editingSlide.PO_ID}`
        : "/api/admin/slides";
      const method = editingSlide ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Error al guardar el slide.");
      } else {
        setActionSuccess(
          editingSlide ? "Slide actualizado correctamente." : "Slide creado exitosamente."
        );
        setTimeout(() => {
          setModalOpen(false);
          loadSlides();
        }, 800);
      }
    } catch (err: any) {
      setActionError("Error al comunicarse con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async () => {
    if (!deleteConfirmSlide) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/slides/${deleteConfirmSlide.PO_ID}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Error al eliminar slide.");
      } else {
        setDeleteConfirmSlide(null);
        loadSlides();
      }
    } catch (err) {
      alert("Error al eliminar slide.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase tracking-tight">
            Slides y Portada
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6472] mt-1">
            Gestión de las imágenes y banners rotativos de la página de inicio.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="py-20 bg-white rounded-2xl border border-[#DDD8CE] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#12355B]" />
          <span className="text-sm font-semibold text-[#5A6472]">
            Cargando slides...
          </span>
        </div>
      ) : slides.length === 0 ? (
        <div className="py-20 bg-white rounded-2xl border border-[#DDD8CE] text-center text-[#5A6472] text-sm">
          No hay slides creados actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => {
            const imageUrl = getDisplaySlideUrl(slide.PO_ARCHIVO);

            return (
              <div
                key={slide.PO_ID}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md ${
                  slide.PO_STATUS === 1
                    ? "border-[#DDD8CE]"
                    : "border-dashed border-gray-300 opacity-60"
                }`}
              >
                {/* Image Preview */}
                <div className="h-44 bg-[#0A1F36] relative flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={slide.PO_TITULO || "Slide"}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#A5BCD4]">
                      <Images className="w-8 h-8 opacity-40" />
                      <span className="text-xs">Sin archivo de imagen</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleStatus(slide)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 ${
                        slide.PO_STATUS === 1
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-800"
                      }`}
                    >
                      {slide.PO_STATUS === 1 ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Order Tag */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
                    Orden: {slide.PO_ORDENAR}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#0F1B2D] uppercase line-clamp-2">
                      {slide.PO_TITULO || "Sin Título"}
                    </h3>
                    {slide.PO_DESCRIPCION && (
                      <p className="text-xs text-[#5A6472] mt-1.5 line-clamp-2 leading-relaxed">
                        {slide.PO_DESCRIPCION}
                      </p>
                    )}
                    <div className="mt-3 text-[11px] text-[#8A96A5] font-mono truncate">
                      Archivo: {slide.PO_ARCHIVO || "—"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EAE5DB]">
                    <span className="text-xs text-[#8A96A5]">ID #{slide.PO_ID}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(slide)}
                        className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white text-[#5A6472] transition-colors border border-[#DDD8CE]"
                        title="Editar slide"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmSlide(slide)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors border border-rose-200"
                        title="Eliminar slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Slide */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className="bg-white rounded-2xl max-w-xl w-full my-6 max-h-[92vh] overflow-hidden shadow-2xl border border-[#DDD8CE] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-[#0A1F36] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white uppercase">
                    {editingSlide ? "Editar Slide" : "Nuevo Slide de Portada"}
                  </h3>
                  <div className="text-xs text-[#A5BCD4]">
                    {editingSlide
                      ? `Modificando Slide #${editingSlide.PO_ID}`
                      : "Configurar banner para la página principal"}
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
            <form onSubmit={handleSaveSlide} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(92vh-130px)]">
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

              {/* Sección de Imagen del Slide */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D] flex items-center justify-between">
                  <span>Imagen del Banner / Slide</span>
                  {formData.archivo && (
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                      Imagen cargada
                    </span>
                  )}
                </label>

                {/* Previsualización si existe */}
                {formData.archivo ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#DDD8CE] bg-[#0A1F36] shadow-inner group">
                    <div className="h-44 w-full flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl || getDisplaySlideUrl(formData.archivo) || ""}
                        alt="Previsualización"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>

                    {/* Overlay informativo y botón cambiar */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-between gap-2 text-white">
                      <span className="text-[11px] font-mono truncate max-w-[280px]" title={formData.archivo}>
                        {formData.archivo}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, archivo: "" });
                          setPreviewUrl(null);
                        }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cambiar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Dropzone para subir */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? "border-[#12355B] bg-[#12355B]/5 scale-[0.99]"
                        : "border-[#CFC9BD] hover:border-[#12355B] bg-[#FAF9F6] hover:bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      disabled={uploadingSlide}
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploadingSlide ? (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#12355B]" />
                        <span className="text-xs font-bold text-[#12355B]">
                          Subiendo banner a portada...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#12355B]/10 text-[#12355B] flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#0F1B2D]">
                            Haz clic aquí o arrastra un banner para subirlo
                          </span>
                          <p className="text-[11px] text-[#5A6472] mt-0.5">
                            Formatos: JPG, PNG, WEBP (hasta 12MB). Se almacenará en la portada.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Opción de ingreso manual por nombre o URL */}
                <div className="flex flex-col gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-xs text-[#12355B] hover:text-[#0A1F36] font-semibold flex items-center gap-1.5 self-start cursor-pointer transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>
                      {showManualUrl
                        ? "Ocultar ingreso manual por nombre/URL"
                        : "+ ¿Deseas ingresar la imagen por nombre de archivo o URL externa?"}
                    </span>
                  </button>

                  {showManualUrl && (
                    <div className="p-3 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl flex flex-col gap-1.5 animate-in fade-in">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.archivo}
                          onChange={(e) => {
                            setFormData({ ...formData, archivo: e.target.value });
                            setPreviewUrl(null);
                          }}
                          placeholder="Ej: WhatsApp Image 2026-10-24 at 11.30.00.jpeg o https://..."
                          className="flex-1 h-10 px-3 bg-white border border-[#CFC9BD] rounded-lg text-xs text-[#0F1B2D] outline-hidden focus:border-[#12355B] font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-[#8A96A5]">
                        Nombre de archivo ubicado en la carpeta portada de Banahosting o URL completa.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Título del Slide
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ej: DISTRIBUCIÓN INTEGRAL DE GAVETEROS"
                  className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Descripción / Subtítulo
                </label>
                <textarea
                  rows={2}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Texto descriptivo complementario..."
                  className="w-full p-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    value={formData.ordenar}
                    onChange={(e) =>
                      setFormData({ ...formData, ordenar: Number(e.target.value) })
                    }
                    className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                    Estado de Publicación
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: Number(e.target.value) })
                    }
                    className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  >
                    <option value={1}>Activo (Visible)</option>
                    <option value={0}>Inactivo (Oculto)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#EAE5DB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#5A6472] hover:text-[#0F1B2D] rounded-xl hover:bg-[#FAF9F6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-70 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Slide</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirmSlide && (
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
                ¿Eliminar Slide?
              </h3>
              <p className="text-xs text-[#5A6472] mt-1">
                Se quitará el slide <strong>{deleteConfirmSlide.PO_TITULO || `#${deleteConfirmSlide.PO_ID}`}</strong> de la portada.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setDeleteConfirmSlide(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDD8CE] text-xs font-bold text-[#5A6472] hover:bg-[#FAF9F6]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSlide}
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
