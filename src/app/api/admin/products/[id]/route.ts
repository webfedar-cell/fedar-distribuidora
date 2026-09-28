import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Obtener un producto por ID con sus fotos
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId) {
      return NextResponse.json({ success: false, message: "ID de producto inválido." }, { status: 400 });
    }

    const rows = await query("SELECT * FROM PRODUCTOS WHERE PR_ID = ? LIMIT 1", [productId]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: "Producto no encontrado." }, { status: 404 });
    }

    const photos = await query("SELECT * FROM FOTOS WHERE FO_IDPRODUCTO = ? ORDER BY FO_PRINCIPAL DESC, FO_ID ASC", [productId]);

    return NextResponse.json({
      success: true,
      product: rows[0],
      photos,
    });
  } catch (error: any) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener producto.", error: error?.message },
      { status: 500 }
    );
  }
}

// PUT: Actualizar producto
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId) {
      return NextResponse.json({ success: false, message: "ID de producto inválido." }, { status: 400 });
    }

    const body = await req.json();
    const {
      titulo,
      descripcion = "",
      url = "",
      categoria = 0,
      subcategoria = 0,
      precio = 0,
      stock = 0,
      ordenar = 0,
      importancia = 0,
      status = 1,
      foto = "",
    } = body;

    if (!titulo || !titulo.trim()) {
      return NextResponse.json({ success: false, message: "El título es obligatorio." }, { status: 400 });
    }

    const slug = (url && url.trim()) ? url.trim() : titulo.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const updateSql = `
      UPDATE PRODUCTOS SET 
        PR_TITULO = ?, PR_DESCRIPCION = ?, PR_URL = ?, 
        PR_CATEGORIA = ?, PR_SUBCATEGORIA = ?, PR_PRECIO = ?, 
        PR_STOCK = ?, PR_ORDENAR = ?, PR_IMPORTANCIA = ?, 
        PR_STATUS = ?
      WHERE PR_ID = ?
    `;

    await query(updateSql, [
      titulo.trim(),
      descripcion.trim(),
      slug,
      Number(categoria) || 0,
      Number(subcategoria) || 0,
      Number(precio) || 0,
      Number(stock) || 0,
      Number(ordenar) || 0,
      Number(importancia) || 0,
      Number(status) !== undefined ? Number(status) : 1,
      productId,
    ]);

    // Actualizar o insertar foto principal si se proveyó
    if (foto && foto.trim()) {
      const existingPhoto = await query("SELECT FO_ID FROM FOTOS WHERE FO_IDPRODUCTO = ? LIMIT 1", [productId]);
      if (existingPhoto && existingPhoto.length > 0) {
        await query(
          "UPDATE FOTOS SET FO_ARCHIVO = ? WHERE FO_ID = ?",
          [foto.trim(), (existingPhoto[0] as any).FO_ID]
        );
      } else {
        await query(
          "INSERT INTO FOTOS (FO_IDPRODUCTO, FO_ARCHIVO, FO_PRINCIPAL) VALUES (?, ?, 1)",
          [productId, foto.trim()]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Producto actualizado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar producto.", error: error?.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar producto
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId) {
      return NextResponse.json({ success: false, message: "ID de producto inválido." }, { status: 400 });
    }

    // Eliminar fotos asociadas
    await query("DELETE FROM FOTOS WHERE FO_IDPRODUCTO = ?", [productId]);
    // Eliminar producto
    await query("DELETE FROM PRODUCTOS WHERE PR_ID = ?", [productId]);

    return NextResponse.json({
      success: true,
      message: "Producto eliminado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar producto.", error: error?.message },
      { status: 500 }
    );
  }
}
