import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CATEGORIES_LIST, ProductItem } from "@/data/products";

export async function GET() {
  try {
    // 1. Query PRODUCTOS joined with CATEGORIAS and FOTOS
    const rows = await query<any>(
      `SELECT 
        p.PR_ID, 
        p.PR_TITULO, 
        p.PR_DESCRIPCION, 
        p.PR_URL, 
        p.PR_CATEGORIA, 
        p.PR_SUBCATEGORIA, 
        p.PR_PRECIO, 
        p.PR_STOCK, 
        p.PR_ORDENAR, 
        p.PR_IMPORTANCIA, 
        p.PR_STATUS,
        c.CA_NOMBRE AS CATEGORIA_NOMBRE,
        s.SUB_NOMBRE AS SUBCATEGORIA_NOMBRE,
        f.FO_ARCHIVO AS FOTO_ARCHIVO
      FROM \`PRODUCTOS\` p
      LEFT JOIN \`CATEGORIAS\` c ON p.PR_CATEGORIA = c.CA_ID
      LEFT JOIN \`SUBCATEGORIAS\` s ON p.PR_SUBCATEGORIA = s.SUB_ID
      LEFT JOIN \`FOTOS\` f ON (
        f.FO_IDPRODUCTO = p.PR_ID AND (
          f.FO_PRINCIPAL = 1 OR f.FO_ID = (
            SELECT MIN(f2.FO_ID) FROM \`FOTOS\` f2 WHERE f2.FO_IDPRODUCTO = p.PR_ID
          )
        )
      )
      WHERE p.PR_STATUS = 1 
      GROUP BY p.PR_ID
      ORDER BY p.PR_ORDENAR ASC, p.PR_TITULO ASC`
    );

    if (rows && rows.length > 0) {
      const photosBaseUrl =
        process.env.NEXT_PUBLIC_PHOTOS_URL || "https://fedardistribuidora.com.ar/uploads";

      // Map rows to ProductItem structure
      const products: ProductItem[] = rows.map((row: any, index: number) => {
        const num = String(index + 1).padStart(2, "0");
        const title = (row.PR_TITULO || "").trim();
        const desc = (row.PR_DESCRIPCION || "").trim();
        const categoryName = (row.CATEGORIA_NOMBRE || "General").trim();
        const subCategoryName = (row.SUBCATEGORIA_NOMBRE || "").trim();
        const fileName = (row.FOTO_ARCHIVO || "").trim();

        // Parse items from description if it contains lines or delimiters
        let items: string[] = [];
        if (desc.includes(":") || desc.includes("\n") || desc.includes("-") || desc.includes("•")) {
          items = desc
            .split(/[:\n•-]/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 2 && !s.toLowerCase().startsWith("gavetero"));
        }
        if (items.length === 0) {
          items = [`Variedad completa de medidas para ${title}`];
        }

        const imageUrl = fileName
          ? `${photosBaseUrl.replace(/\/$/, "")}/${encodeURI(fileName)}`
          : undefined;

        return {
          id: row.PR_URL ? row.PR_URL.toLowerCase() : String(row.PR_ID),
          num,
          name: title,
          photoLabel: `Foto: ${title}`,
          imageUrl,
          subCategory: subCategoryName || undefined,
          shortDesc: desc || `Línea de ${title} para ferreterías y buloneras.`,
          category: categoryName,
          iconName: "Layers",
          description: desc || `Catálogo oficial mayorista de ${title}.`,
          items,
          popularIn: ["Ferreterías", "Buloneras", "Repuesteras"],
          gaveteroOption: desc.toLowerCase().includes("gavetero") ? "Incluye opción gavetero organizador" : undefined,
        };
      });

      return NextResponse.json({
        success: true,
        source: "mysql",
        total: products.length,
        data: products,
      });
    }

    // Fallback if table is empty
    return NextResponse.json({
      success: true,
      source: "static_fallback",
      total: CATEGORIES_LIST.length,
      data: CATEGORIES_LIST,
    });
  } catch (error: any) {
    // If MySQL connection fails, return default catalog
    return NextResponse.json({
      success: true,
      source: "static_fallback",
      error: error.message,
      total: CATEGORIES_LIST.length,
      data: CATEGORIES_LIST,
    });
  }
}
