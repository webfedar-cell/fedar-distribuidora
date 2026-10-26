"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
  Star,
  Upload,
  Link2,
} from "lucide-react";

export interface ProductPhoto {
  FO_ID?: number;
  FO_IDPRODUCTO?: number;
  FO_ARCHIVO: string;
  FO_PRINCIPAL: number;
  previewUrl?: string;
}

interface ProductItem {
  PR_ID: number;
  PR_TITULO: string;
  PR_DESCRIPCION: string;
  PR_URL: string;
  PR_CATEGORIA: number;
  PR_SUBCATEGORIA: number;
  PR_PRECIO: number;
  PR_STOCK: number;
  PR_ORDENAR: number;
  PR_IMPORTANCIA: number;
  PR_STATUS: number;
  CA_NOMBRE?: string;
  SUB_NOMBRE?: string;
  FOTO_PRINCIPAL?: string;
}

interface CategoryItem {
  CA_ID: number;
  CA_NOMBRE: string;
  CA_ORDEN: number;
}

interface SubcategoryItem {
  SUB_ID: number;
  SUB_NOMBRE: string;
  SUB_CATEGORIA: number;
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSort, setSelectedSort] = useState("order");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url: "",
    categoria: 0,
    subcategoria: 0,
    precio: 0,
    stock: 0,
    ordenar: 0,
    importancia: 0,
    status: 1,
    foto: "",
  });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Photos State for Create / Edit
  const [productPhotos, setProductPhotos] = useState<ProductPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState("");
  const [showAddUrlInput, setShowAddUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Delete State
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const photosBaseUrl =
    process.env.NEXT_PUBLIC_PHOTOS_URL || "https://fedardistribuidora.com.ar/uploads/";

  const getDisplayPhotoUrl = (photo: ProductPhoto | string | undefined | null) => {
    if (!photo) return "";
    if (typeof photo === "object" && photo.previewUrl) return photo.previewUrl;
    const file = typeof photo === "object" ? photo.FO_ARCHIVO : photo;
    if (!file) return "";
    const trimmed = file.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
    return `/uploads/${encodeURIComponent(trimmed)}`;
  };

  // Cargar Categorías
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setSubcategories(data.subcategories || []);
        }
      } catch (e) {
        console.error("Error al cargar categorías:", e);
      }
    }
    loadCategories();
  }, []);

  // Cargar Productos
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        sortBy: selectedSort,
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedStatus, selectedSort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      titulo: "",
      descripcion: "",
      url: "",
      categoria: categories[0]?.CA_ID || 0,
      subcategoria: 0,
      precio: 0,
      stock: 0,
      ordenar: 0,
      importancia: 0,
      status: 1,
      foto: "",
    });
    setProductPhotos([]);
    setNewPhotoUrlInput("");
    setShowAddUrlInput(false);
    setActionError("");
    setActionSuccess("");
    setModalOpen(true);
  };

  const handleOpenEdit = async (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      titulo: product.PR_TITULO,
      descripcion: product.PR_DESCRIPCION || "",
      url: product.PR_URL || "",
      categoria: product.PR_CATEGORIA,
      subcategoria: product.PR_SUBCATEGORIA,
      precio: product.PR_PRECIO,
      stock: product.PR_STOCK,
      ordenar: product.PR_ORDENAR,
      importancia: product.PR_IMPORTANCIA,
      status: product.PR_STATUS,
      foto: product.FOTO_PRINCIPAL || "",
    });
    setNewPhotoUrlInput("");
    setShowAddUrlInput(false);
    setActionError("");
    setActionSuccess("");
    setModalOpen(true);

    // Cargar foto principal mientras se solicitan las demás
    if (product.FOTO_PRINCIPAL) {
      setProductPhotos([
        {
          FO_ARCHIVO: product.FOTO_PRINCIPAL,
          FO_PRINCIPAL: 1,
        },
      ]);
    } else {
      setProductPhotos([]);
    }

    // Cargar fotos completas asociadas al producto
    setLoadingPhotos(true);
    try {
      const res = await fetch(`/api/admin/products/${product.PR_ID}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.photos)) {
        if (data.photos.length > 0) {
          const hasPrincipal = data.photos.some((p: any) => p.FO_PRINCIPAL === 1);
          const mapped: ProductPhoto[] = data.photos.map((p: any, idx: number) => ({
            FO_ID: p.FO_ID,
            FO_IDPRODUCTO: p.FO_IDPRODUCTO,
            FO_ARCHIVO: p.FO_ARCHIVO,
            FO_PRINCIPAL: hasPrincipal ? p.FO_PRINCIPAL : idx === 0 ? 1 : 0,
          }));
          setProductPhotos(mapped);
        } else if (product.FOTO_PRINCIPAL) {
          setProductPhotos([
            {
              FO_ARCHIVO: product.FOTO_PRINCIPAL,
              FO_PRINCIPAL: 1,
            },
          ]);
        } else {
          setProductPhotos([]);
        }
      }
    } catch (e) {
      console.error("Error al cargar fotos completas:", e);
    } finally {
      setLoadingPhotos(false);
    }
  };

  // Manejar selección de foto principal
  const handleSetPrincipalPhoto = (index: number) => {
    setProductPhotos((prev) =>
      prev.map((photo, i) => ({
        ...photo,
        FO_PRINCIPAL: i === index ? 1 : 0,
      }))
    );
  };

  // Eliminar foto de la lista
  const handleRemovePhoto = (index: number) => {
    setProductPhotos((prev) => {
      const wasPrincipal = prev[index]?.FO_PRINCIPAL === 1;
      const updated = prev.filter((_, i) => i !== index);
      if (wasPrincipal && updated.length > 0) {
        updated[0].FO_PRINCIPAL = 1;
      }
      return updated;
    });
  };

  // Procesar archivos subidos
  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      setActionError("Por favor selecciona archivos de imagen válidos (JPG, PNG, WEBP).");
      return;
    }

    setUploadingPhotos(true);
    setActionError("");

    try {
      const uploadFormData = new FormData();
      files.forEach((f) => uploadFormData.append("files", f));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.message || "Error al subir las imágenes.");
      } else {
        const uploadedList = data.files || [];
        setProductPhotos((prev) => {
          const hadPrincipal = prev.some((p) => p.FO_PRINCIPAL === 1);
          const newEntries: ProductPhoto[] = uploadedList.map((item: any, idx: number) => ({
            FO_ARCHIVO: item.filename,
            FO_PRINCIPAL: !hadPrincipal && idx === 0 ? 1 : 0,
            previewUrl: item.url,
          }));
          return [...prev, ...newEntries];
        });
      }
    } catch (err: any) {
      console.error("Error al subir fotos:", err);
      setActionError("Error al comunicarse con el servidor al subir imágenes.");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  // Añadir foto manual por URL o nombre
  const handleAddManualPhoto = () => {
    const trimmed = newPhotoUrlInput.trim();
    if (!trimmed) return;

    setProductPhotos((prev) => {
      const hadPrincipal = prev.some((p) => p.FO_PRINCIPAL === 1);
      return [
        ...prev,
        {
          FO_ARCHIVO: trimmed,
          FO_PRINCIPAL: !hadPrincipal ? 1 : 0,
        },
      ];
    });

    setNewPhotoUrlInput("");
    setShowAddUrlInput(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!formData.titulo.trim()) {
      setActionError("El título del producto es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.PR_ID}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const principalPhoto = productPhotos.find((p) => p.FO_PRINCIPAL === 1) || productPhotos[0];

      const payload = {
        ...formData,
        photos: productPhotos,
        foto: principalPhoto ? principalPhoto.FO_ARCHIVO : "",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || "Error al guardar el producto.");
      } else {
        setActionSuccess(
          editingProduct
            ? "Producto actualizado correctamente."
            : "Producto creado exitosamente."
        );
        setTimeout(() => {
          setModalOpen(false);
          loadProducts();
        }, 800);
      }
    } catch (err: any) {
      setActionError("Error al comunicarse con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmProduct) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteConfirmProduct.PR_ID}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Error al eliminar producto.");
      } else {
        setDeleteConfirmProduct(null);
        loadProducts();
      }
    } catch (err) {
      alert("Error al eliminar producto.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtrar subcategorías según la categoría seleccionada en el formulario
  const currentSubcategories = subcategories.filter(
    (sub) => sub.SUB_CATEGORIA === Number(formData.categoria)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F1B2D] uppercase tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6472] mt-1">
            Gestión completa de artículos, stock, precios e imágenes asociadas ({totalCount} productos).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDD8CE] shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por título, código o descripción..."
            className="w-full h-11 pl-10 pr-4 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-[#8A96A5] absolute left-3.5 top-3.5" />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="h-11 px-3 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl text-xs sm:text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((cat) => (
            <option key={cat.CA_ID} value={cat.CA_ID}>
              {cat.CA_NOMBRE}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="h-11 px-3 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl text-xs sm:text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
        >
          <option value="all">Todos los Estados</option>
          <option value="1">Activos</option>
          <option value="0">Inactivos</option>
        </select>

        {/* Sort Filter */}
        <select
          value={selectedSort}
          onChange={(e) => {
            setSelectedSort(e.target.value);
            setCurrentPage(1);
          }}
          className="h-11 px-3 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl text-xs sm:text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white font-medium"
        >
          <option value="order">Ordenar por: N° Orden (Catálogo)</option>
          <option value="id_desc">Ordenar por: Más recientes (ID)</option>
          <option value="title_asc">Ordenar por: Título (A-Z)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#DDD8CE] shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#12355B]" />
            <span className="text-sm font-semibold text-[#5A6472]">
              Cargando catálogo de productos...
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-[#5A6472] text-sm">
            No se encontraron productos con los filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F1B2D]">
              <thead className="bg-[#0A1F36] text-[#C9D6E3] text-xs uppercase font-heading tracking-wider border-b border-[#142C4B]">
                <tr>
                  <th className="py-3.5 px-3 text-center w-20">N° Orden</th>
                  <th className="py-3.5 px-4">Foto</th>
                  <th className="py-3.5 px-4">Título / Detalle</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DB]">
                {products.map((prod) => {
                  const photoUrl = prod.FOTO_PRINCIPAL
                    ? getDisplayPhotoUrl(prod.FOTO_PRINCIPAL)
                    : null;

                  return (
                    <tr
                      key={prod.PR_ID}
                      className="hover:bg-[#FAF9F6] transition-colors"
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className="inline-flex items-center justify-center min-w-9 px-2 py-1 rounded-lg bg-[#FAF9F6] border border-[#DDD8CE] font-mono text-xs font-extrabold text-[#12355B] shadow-2xs"
                          title={`Orden de visualización: #${prod.PR_ORDENAR || 0}`}
                        >
                          #{prod.PR_ORDENAR || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#DDD8CE] overflow-hidden flex items-center justify-center">
                          {photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photoUrl}
                              alt={prod.PR_TITULO}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#CFC9BD]" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-[#0F1B2D] line-clamp-1">
                            {prod.PR_TITULO}
                          </div>
                          {prod.PR_DESCRIPCION && (
                            <div className="text-xs text-[#5A6472] line-clamp-1 mt-0.5">
                              {prod.PR_DESCRIPCION}
                            </div>
                          )}
                          <div className="text-[10px] text-[#8A96A5] font-mono mt-0.5">
                            ID: #{prod.PR_ID} &bull; Slug: {prod.PR_URL}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-[#5A6472]">
                        <div>{prod.CA_NOMBRE || "Sin categoría"}</div>
                        {prod.SUB_NOMBRE && (
                          <div className="text-[11px] text-[#8A96A5] font-normal">
                            {prod.SUB_NOMBRE}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-[#0F1B2D]">
                        ${prod.PR_PRECIO > 0 ? prod.PR_PRECIO.toLocaleString("es-AR") : "Consultar"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            prod.PR_STATUS === 1
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {prod.PR_STATUS === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-lg bg-[#FAF9F6] hover:bg-[#12355B] hover:text-white text-[#5A6472] transition-colors border border-[#DDD8CE]"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmProduct(prod)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors border border-rose-200"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#EAE5DB] bg-[#FAF9F6] flex items-center justify-between">
            <span className="text-xs text-[#5A6472] font-medium">
              Página {currentPage} de {totalPages} ({totalCount} productos)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-[#DDD8CE] text-[#0F1B2D] disabled:opacity-40 hover:bg-[#FAF9F6] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-[#DDD8CE] text-[#0F1B2D] disabled:opacity-40 hover:bg-[#FAF9F6] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Producto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className="bg-white rounded-2xl max-w-3xl w-full my-6 max-h-[92vh] overflow-hidden shadow-2xl border border-[#DDD8CE] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-[#0A1F36] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E0A93B]/20 text-[#E0A93B] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white uppercase">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h3>
                  <div className="text-xs text-[#A5BCD4]">
                    {editingProduct
                      ? `Modificando ID #${editingProduct.PR_ID}`
                      : "Ingresar nuevo artículo al catálogo"}
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
            <form onSubmit={handleSaveProduct} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(92vh-130px)]">
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
                  Título del Producto
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ej: GAVETERO DE TERMINALES ELÉCTRICAS"
                  className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                    Categoría
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoria: Number(e.target.value),
                        subcategoria: 0,
                      })
                    }
                    className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  >
                    <option value={0}>Seleccionar Categoría...</option>
                    {categories.map((cat) => (
                      <option key={cat.CA_ID} value={cat.CA_ID}>
                        {cat.CA_NOMBRE}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                    Subcategoría
                  </label>
                  <select
                    value={formData.subcategoria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subcategoria: Number(e.target.value),
                      })
                    }
                    className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                  >
                    <option value={0}>Ninguna / General</option>
                    {currentSubcategories.map((sub) => (
                      <option key={sub.SUB_ID} value={sub.SUB_ID}>
                        {sub.SUB_NOMBRE}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Especificaciones técnicas, modelos incluidos, medidas..."
                  className="w-full p-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Precio Mayorista ($)
                    </label>
                    <input
                      type="number"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: Number(e.target.value) })
                      }
                      className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: Number(e.target.value) })
                      }
                      className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] outline-hidden focus:border-[#12355B] focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D] flex items-center justify-between">
                      <span>N° de Orden</span>
                      <span className="text-[10px] text-[#8A96A5] font-normal lowercase">(posición)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.ordenar}
                      onChange={(e) =>
                        setFormData({ ...formData, ordenar: Number(e.target.value) })
                      }
                      placeholder="Ej: 10, 20..."
                      className="w-full h-11 px-3 bg-[#FAF9F6] border border-[#CFC9BD] rounded-lg text-sm text-[#0F1B2D] font-mono font-bold outline-hidden focus:border-[#12355B] focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
                      Estado
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
                <span className="text-[11px] text-[#8A96A5]">
                  El número de orden define la posición del producto en el catálogo (los números menores aparecen primero, ej: 1, 2, 3...).
                </span>
              </div>

              {/* Sección de Fotos del Producto */}
              <div className="flex flex-col gap-3 pt-3 pb-1 border-t border-[#EAE5DB]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#E0A93B]/20 text-[#B88218] flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0F1B2D] flex items-center gap-2">
                        <span>Fotos del Producto</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#12355B]/10 text-[#12355B]">
                          {productPhotos.length}
                        </span>
                      </label>
                      <p className="text-[11px] text-[#5A6472]">
                        Haz clic en <strong>⭐ Hacer Principal</strong> para elegir cuál será la foto de portada.
                      </p>
                    </div>
                  </div>

                  {productPhotos.length > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#E0A93B] fill-[#E0A93B]" />
                      <span>
                        Principal:{" "}
                        {productPhotos.find((p) => p.FO_PRINCIPAL === 1)?.FO_ARCHIVO || "Primera"}
                      </span>
                    </span>
                  )}
                </div>

                {loadingPhotos ? (
                  <div className="py-8 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl flex items-center justify-center gap-2 text-xs text-[#5A6472]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#12355B]" />
                    <span>Cargando fotos del producto...</span>
                  </div>
                ) : (
                  <>
                    {/* Galería de fotos existentes */}
                    {productPhotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {productPhotos.map((photo, index) => {
                          const isPrincipal = photo.FO_PRINCIPAL === 1;
                          const displayUrl = getDisplayPhotoUrl(photo);

                          return (
                            <div
                              key={photo.FO_ID ? `db-${photo.FO_ID}` : `temp-${index}-${photo.FO_ARCHIVO}`}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col bg-white shadow-xs ${
                                isPrincipal
                                  ? "border-[#E0A93B] ring-2 ring-[#E0A93B]/40"
                                  : "border-[#DDD8CE] hover:border-[#12355B]/50"
                              }`}
                            >
                              {/* Badge Principal */}
                              {isPrincipal && (
                                <div className="absolute top-2 left-2 z-10 bg-[#E0A93B] text-[#0A1F36] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 tracking-wider">
                                  <Star className="w-3 h-3 fill-[#0A1F36]" />
                                  <span>Principal</span>
                                </div>
                              )}

                              {/* Botón Eliminar */}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                title="Eliminar foto"
                                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-600 text-[#5A6472] hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Thumbnail Imagen */}
                              <div className="w-full aspect-square bg-[#FAF9F6] flex items-center justify-center overflow-hidden">
                                {displayUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={displayUrl}
                                    alt={photo.FO_ARCHIVO}
                                    className="w-full h-full object-cover"
                                    onError={(e: any) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <ImageIcon className="w-8 h-8 text-[#CFC9BD]" />
                                )}
                              </div>

                              {/* Info & Botón para seleccionar principal */}
                              <div className="p-2 border-t border-[#EAE5DB] bg-[#FAF9F6] flex flex-col gap-1.5">
                                <div
                                  className="text-[10px] text-[#5A6472] font-mono truncate"
                                  title={photo.FO_ARCHIVO}
                                >
                                  {photo.FO_ARCHIVO}
                                </div>

                                {isPrincipal ? (
                                  <div className="py-1 px-2 rounded-lg bg-[#0A1F36] text-[#E0A93B] text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                                    <Star className="w-3 h-3 fill-[#E0A93B]" />
                                    <span>Foto Portada</span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrincipalPhoto(index)}
                                    className="w-full py-1 px-2 rounded-lg bg-white hover:bg-[#12355B] text-[#5A6472] hover:text-white border border-[#DDD8CE] text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Star className="w-3 h-3 text-[#E0A93B]" />
                                    <span>Hacer Principal</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Dropzone para subir fotos */}
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
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        disabled={uploadingPhotos}
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {uploadingPhotos ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[#12355B]" />
                          <span className="text-xs font-bold text-[#12355B]">
                            Subiendo imagen(es)... por favor espera.
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-[#12355B]/10 text-[#12355B] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1B2D]">
                              Haz clic aquí o arrastra fotos para subirlas
                            </span>
                            <p className="text-[11px] text-[#5A6472] mt-0.5">
                              Formatos permitidos: JPG, PNG, WEBP (hasta 12MB). Puedes seleccionar varias a la vez.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Opción de agregar manualmente por URL o nombre en Banahosting */}
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUrlInput(!showAddUrlInput)}
                        className="text-xs text-[#12355B] hover:text-[#0A1F36] font-semibold flex items-center gap-1.5 self-start cursor-pointer transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>
                          {showAddUrlInput
                            ? "Ocultar ingreso manual por nombre/URL"
                            : "+ ¿Deseas agregar una foto por nombre de archivo o URL?"}
                        </span>
                      </button>

                      {showAddUrlInput && (
                        <div className="p-3 bg-[#FAF9F6] border border-[#DDD8CE] rounded-xl flex flex-col sm:flex-row gap-2 animate-in fade-in">
                          <input
                            type="text"
                            value={newPhotoUrlInput}
                            onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddManualPhoto();
                              }
                            }}
                            placeholder="Ej: cam.jpg o https://dominio.com/foto.jpg"
                            className="flex-1 h-10 px-3 bg-white border border-[#CFC9BD] rounded-lg text-xs text-[#0F1B2D] outline-hidden focus:border-[#12355B] font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddManualPhoto}
                            className="px-4 py-2 bg-[#12355B] hover:bg-[#0A1F36] text-white text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap transition-colors"
                          >
                            Añadir Foto
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#EAE5DB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#5A6472] hover:text-[#0F1B2D] rounded-xl hover:bg-[#FAF9F6] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingPhotos}
                  className="px-5 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0A1F36] text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-70 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Producto</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirmProduct && (
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
                ¿Eliminar Producto?
              </h3>
              <p className="text-xs text-[#5A6472] mt-1">
                Se eliminará <strong>{deleteConfirmProduct.PR_TITULO}</strong> del catálogo de la distribuidora.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDD8CE] text-xs font-bold text-[#5A6472] hover:bg-[#FAF9F6]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
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
