import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const categories = await query("SELECT CA_ID, CA_NOMBRE, CA_ORDEN FROM CATEGORIAS ORDER BY CA_NOMBRE ASC");
    const subcategories = await query("SELECT SUB_ID, SUB_NOMBRE, SUB_CATEGORIA FROM SUBCATEGORIAS ORDER BY SUB_NOMBRE ASC");

    return NextResponse.json({
      success: true,
      categories,
      subcategories,
    });
  } catch (error: any) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener categorías.", error: error?.message },
      { status: 500 }
    );
  }
}
