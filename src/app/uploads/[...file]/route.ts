import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { query } from "@/lib/db";

// GET /uploads/[...file]
// Serves files from:
// 1. Local disk (public/uploads) if exists
// 2. MySQL database (IMAGENES_ARCHIVOS) if uploaded in serverless (e.g. Vercel)
// 3. Banahosting remote uploads fallback for legacy photos
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string[] }> }
) {
  try {
    const { file } = await context.params;
    if (!file || file.length === 0) {
      return NextResponse.json({ error: "Archivo no especificado." }, { status: 400 });
    }

    // Sanitize path against directory traversal
    const relativePath = file.map((segment) => path.basename(segment)).join("/");

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
    };

    // 1. Servir desde disco local si existe (buscar en public/uploads y ../public_html/uploads)
    const decodedName = decodeURIComponent(relativePath);
    const candidatePaths = [
      path.join(process.cwd(), "public", "uploads", relativePath),
      path.join(process.cwd(), "public", "uploads", decodedName),
      path.join(process.cwd(), "..", "public_html", "uploads", relativePath),
      path.join(process.cwd(), "..", "public_html", "uploads", decodedName),
    ];

    for (const filePath of candidatePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const stat = await fs.promises.stat(filePath);
          if (stat.isFile()) {
            const fileBuffer = await fs.promises.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || "image/jpeg";

            return new NextResponse(fileBuffer, {
              headers: {
                "Content-Type": contentType,
                "Content-Length": stat.size.toString(),
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
              },
            });
          }
        }
      } catch {
        // Continuar buscando
      }
    }

    // 2. Buscar en base de datos MySQL (IMAGENES_ARCHIVOS)
    try {
      const rows = await query<any>(
        "SELECT mime_type, size, data FROM IMAGENES_ARCHIVOS WHERE (filename = ? OR filename = ?) AND folder = 'uploads' LIMIT 1",
        [relativePath, decodedName]
      );
      if (rows && rows.length > 0) {
        const img = rows[0];
        const ext = path.extname(relativePath).toLowerCase();
        const contentType = img.mime_type || mimeTypes[ext] || "image/jpeg";
        const buffer = Buffer.isBuffer(img.data) ? img.data : Buffer.from(img.data);

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Length": (img.size || buffer.length).toString(),
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }
    } catch (dbErr) {
      console.error("Error al consultar imagen en DB:", dbErr);
    }

    // 3. Fallback remoto o evitar bucle infinito
    const host = req.headers.get("host") || "";
    const remoteBase =
      process.env.NEXT_PUBLIC_PHOTOS_URL || "https://fedardistribuidora.com.ar/uploads/";
    const isSameHost = host && (remoteBase.includes(host) || host.includes("fedardistribuidora"));

    if (isSameHost) {
      return new NextResponse(null, { status: 404 });
    }

    const remoteUrl = `${remoteBase.replace(/\/$/, "")}/${encodeURI(decodedName)}`;
    return NextResponse.redirect(remoteUrl, 307);
  } catch (error: any) {
    console.error("Error al servir imagen de uploads:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el archivo." },
      { status: 500 }
    );
  }
}
