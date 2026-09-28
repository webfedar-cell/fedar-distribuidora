import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Listar slides de portada
export async function GET() {
  try {
    const slides = await query(`
      SELECT 
        p.PO_ID,
        p.PO_ARCHIVO,
        p.PO_TITULO,
        p.PO_DESCRIPCION,
        p.PO_IDPRODUCTO,
        p.PO_ORDENAR,
        p.PO_STATUS,
        prod.PR_TITULO AS PRODUCTO_TITULO
      FROM PORTADA p
      LEFT JOIN PRODUCTOS prod ON prod.PR_ID = p.PO_IDPRODUCTO
      ORDER BY p.PO_ORDENAR ASC, p.PO_ID DESC
    `);

    return NextResponse.json({
      success: true,
      slides,
    });
  } catch (error: any) {
    console.error("Error al obtener slides:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener slides.", error: error?.message },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo slide
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      archivo = "",
      titulo = "",
      descripcion = "",
      idProducto = 0,
      ordenar = 1,
      status = 1,
    } = body;

    if (!archivo && !titulo) {
      return NextResponse.json(
        { success: false, message: "Debe indicar al menos una imagen o un título para el slide." },
        { status: 400 }
      );
    }

    const insertSql = `
      INSERT INTO PORTADA (
        PO_ARCHIVO, PO_TITULO, PO_DESCRIPCION, 
        PO_IDPRODUCTO, PO_ORDENAR, PO_STATUS
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result: any = await query(insertSql, [
      archivo.trim(),
      titulo.trim(),
      descripcion.trim(),
      Number(idProducto) || 0,
      Number(ordenar) || 1,
      Number(status) !== undefined ? Number(status) : 1,
    ]);

    return NextResponse.json({
      success: true,
      message: "Slide creado correctamente.",
      slideId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error al crear slide:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear slide.", error: error?.message },
      { status: 500 }
    );
  }
}
