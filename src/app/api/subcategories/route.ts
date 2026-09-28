import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");

    let sql = `
      SELECT 
        s.SUB_ID as id, 
        s.SUB_NOMBRE as name, 
        s.SUB_CATEGORIA as category_id,
        c.CA_NOMBRE as category_name
      FROM \`SUBCATEGORIAS\` s
      LEFT JOIN \`CATEGORIAS\` c ON s.SUB_CATEGORIA = c.CA_ID
    `;
    const params: any[] = [];

    if (categoryId) {
      sql += " WHERE s.SUB_CATEGORIA = ?";
      params.push(categoryId);
    }

    sql += " ORDER BY s.SUB_NOMBRE ASC";

    const rows = await query<any>(sql, params);

    return NextResponse.json({
      success: true,
      source: "mysql",
      total: rows.length,
      data: rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      source: "fallback",
      total: 0,
      data: [],
    });
  }
}
