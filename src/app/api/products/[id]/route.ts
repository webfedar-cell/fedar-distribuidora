import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CATEGORIES_LIST, ProductItem } from "@/data/products";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const decodedId = decodeURIComponent(id).trim();

    // Try finding by PR_ID (if numeric) or PR_URL
    const isNumeric = /^\d+$/.test(decodedId);
    let whereClause = "WHERE (p.PR_URL = ? OR p.PR_TITULO = ?)";
    const queryParams: any[] = [decodedId, decodedId];

    if (isNumeric) {
      whereClause = "WHERE (p.PR_ID = ? OR p.PR_URL = ?)";
      queryParams.unshift(parseInt(decodedId, 10));
    }

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
        s.SUB_NOMBRE AS SUBCATEGORIA_NOMBRE
      FROM \`PRODUCTOS\` p
      LEFT JOIN \`CATEGORIAS\` c ON p.PR_CATEGORIA = c.CA_ID
      LEFT JOIN \`SUBCATEGORIAS\` s ON p.PR_SUBCATEGORIA = s.SUB_ID
      ${whereClause}
      LIMIT 1`,
      queryParams
    );

    if (rows && rows.length > 0) {
      const row = rows[0];
      const photosBaseUrl =
        process.env.PHOTOS_URL ||
        process.env.NEXT_PUBLIC_PHOTOS_URL ||
        "https://fedardistribuidora.com.ar/uploads";

      // Fetch all photos for this product
      const photoRows = await query<any>(
        `SELECT FO_ID, FO_ARCHIVO, FO_PRINCIPAL 
         FROM \`FOTOS\` 
         WHERE FO_IDPRODUCTO = ? 
         ORDER BY FO_PRINCIPAL DESC, FO_ID ASC`,
        [row.PR_ID]
      );

      const photos = (photoRows || [])
        .map((f: any) => (f.FO_ARCHIVO ? `${photosBaseUrl.replace(/\/$/, "")}/${encodeURI(f.FO_ARCHIVO.trim())}` : null))
        .filter(Boolean) as string[];

      const title = (row.PR_TITULO || "").trim();
      const desc = (row.PR_DESCRIPCION || "").trim();
      const categoryName = (row.CATEGORIA_NOMBRE || "General").trim();
      const subCategoryName = (row.SUBCATEGORIA_NOMBRE || "").trim();

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

      const product: ProductItem & { allPhotos: string[] } = {
        id: row.PR_URL ? row.PR_URL.toLowerCase() : String(row.PR_ID),
        num: String(row.PR_ID),
        name: title,
        photoLabel: `Foto: ${title}`,
        imageUrl: photos.length > 0 ? photos[0] : undefined,
        allPhotos: photos,
        subCategory: subCategoryName || undefined,
        shortDesc: desc || `Línea de ${title} para ferreterías y buloneras.`,
        category: categoryName,
        iconName: "Layers",
        description: desc || `Catálogo oficial mayorista de ${title}.`,
        items,
        popularIn: ["Ferreterías", "Buloneras", "Repuesteras"],
        gaveteroOption: desc.toLowerCase().includes("gavetero")
          ? "Incluye opción gavetero organizador"
          : undefined,
      };

      return NextResponse.json({
        success: true,
        source: "mysql",
        data: product,
      });
    }

    // Static fallback lookup if DB fails or product is from static fallback
    const staticProduct = CATEGORIES_LIST.find(
      (p) =>
        p.id.toLowerCase() === decodedId.toLowerCase() ||
        p.name.toLowerCase() === decodedId.toLowerCase()
    );

    if (staticProduct) {
      return NextResponse.json({
        success: true,
        source: "static_fallback",
        data: {
          ...staticProduct,
          allPhotos: staticProduct.imageUrl ? [staticProduct.imageUrl] : [],
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Producto no encontrado" },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
