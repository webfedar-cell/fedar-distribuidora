import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET /portada/[...file]
// Serves files from public/portada or redirects to Banahosting remote portada fallback
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
    const filePath = path.join(process.cwd(), "public", "portada", relativePath);

    if (fs.existsSync(filePath)) {
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        const fileBuffer = await fs.promises.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();

        const mimeTypes: Record<string, string> = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
          ".avif": "image/avif",
        };

        const contentType = mimeTypes[ext] || "application/octet-stream";

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Length": stat.size.toString(),
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }
    }

    // Remote fallback if not present locally (e.g. Banahosting portada)
    const remoteBase =
      process.env.NEXT_PUBLIC_PORTADA_URL || "https://fedardistribuidora.com.ar/portada/";
    const remoteUrl = `${remoteBase.replace(/\/$/, "")}/${encodeURI(relativePath)}`;

    return NextResponse.redirect(remoteUrl, 307);
  } catch (error: any) {
    console.error("Error al servir imagen de portada:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el archivo de portada." },
      { status: 500 }
    );
  }
}
