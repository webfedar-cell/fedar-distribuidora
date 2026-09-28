import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT: Actualizar slide de portada
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = Number(id);

    if (!slideId) {
      return NextResponse.json({ success: false, message: "ID de slide inválido." }, { status: 400 });
    }

    const body = await req.json();
    const {
      archivo = "",
      titulo = "",
      descripcion = "",
      idProducto = 0,
      ordenar = 1,
      status = 1,
    } = body;

    const updateSql = `
      UPDATE PORTADA SET 
        PO_ARCHIVO = ?, 
        PO_TITULO = ?, 
        PO_DESCRIPCION = ?, 
        PO_IDPRODUCTO = ?, 
        PO_ORDENAR = ?, 
        PO_STATUS = ?
      WHERE PO_ID = ?
    `;

    await query(updateSql, [
      archivo.trim(),
      titulo.trim(),
      descripcion.trim(),
      Number(idProducto) || 0,
      Number(ordenar) || 1,
      Number(status) !== undefined ? Number(status) : 1,
      slideId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Slide actualizado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al actualizar slide:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar slide.", error: error?.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar slide
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slideId = Number(id);

    if (!slideId) {
      return NextResponse.json({ success: false, message: "ID de slide inválido." }, { status: 400 });
    }

    await query("DELETE FROM PORTADA WHERE PO_ID = ?", [slideId]);

    return NextResponse.json({
      success: true,
      message: "Slide eliminado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al eliminar slide:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar slide.", error: error?.message },
      { status: 500 }
    );
  }
}
