import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Listar productos con búsqueda, filtros y fotos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 20);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search.trim()) {
      conditions.push("(p.PR_TITULO LIKE ? OR p.PR_DESCRIPCION LIKE ? OR p.PR_URL LIKE ?)");
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category) {
      conditions.push("p.PR_CATEGORIA = ?");
      params.push(Number(category));
    }

    if (status !== "" && status !== "all") {
      conditions.push("p.PR_STATUS = ?");
      params.push(Number(status));
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // Total de productos para paginación
    const countSql = `SELECT COUNT(*) as total FROM PRODUCTOS p ${whereClause}`;
    const totalResult: any = await query(countSql, params);
    const total = totalResult[0]?.total || 0;

    // Productos con categorías y foto principal
    const sql = `
      SELECT 
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
        c.CA_NOMBRE,
        s.SUB_NOMBRE,
        (SELECT f.FO_ARCHIVO FROM FOTOS f WHERE f.FO_IDPRODUCTO = p.PR_ID ORDER BY f.FO_PRINCIPAL DESC, f.FO_ID ASC LIMIT 1) AS FOTO_PRINCIPAL
      FROM PRODUCTOS p
      LEFT JOIN CATEGORIAS c ON c.CA_ID = p.PR_CATEGORIA
      LEFT JOIN SUBCATEGORIAS s ON s.SUB_ID = p.PR_SUBCATEGORIA
      ${whereClause}
      ORDER BY p.PR_ID DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const products = await query(sql, params);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener productos.", error: error?.message },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo producto
export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json(
        { success: false, message: "El título del producto es obligatorio." },
        { status: 400 }
      );
    }

    const slug = (url && url.trim()) ? url.trim() : titulo.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const insertSql = `
      INSERT INTO PRODUCTOS (
        PR_TITULO, PR_DESCRIPCION, PR_URL, PR_CATEGORIA, 
        PR_SUBCATEGORIA, PR_PRECIO, PR_STOCK, PR_ORDENAR, 
        PR_IMPORTANCIA, PR_STATUS
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result: any = await query(insertSql, [
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
    ]);

    const newProductId = result.insertId;

    // Si se especificó una foto, guardarla en la tabla FOTOS
    if (foto && foto.trim()) {
      await query(
        "INSERT INTO FOTOS (FO_IDPRODUCTO, FO_ARCHIVO, FO_PRINCIPAL) VALUES (?, ?, 1)",
        [newProductId, foto.trim()]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Producto creado correctamente.",
      productId: newProductId,
    });
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear producto.", error: error?.message },
      { status: 500 }
    );
  }
}
