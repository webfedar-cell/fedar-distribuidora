import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (files && files.length > 0) {
      allFiles.push(...files);
    } else if (singleFile) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "No se seleccionó ningún archivo para subir." },
        { status: 400 }
      );
    }

    const folderParam = formData.get("folder") as string | null;
    const targetFolder = folderParam === "portada" ? "portada" : "uploads";
    const uploadDir = path.join(process.cwd(), "public", targetFolder);
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
    const uploadedResults: Array<{ filename: string; url: string; originalName: string }> = [];

    for (const file of allFiles) {
      const originalName = file.name || "imagen";
      const ext = path.extname(originalName).toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            message: `Formato no permitido en "${originalName}". Formatos aceptados: JPG, PNG, WEBP, GIF, SVG.`,
          },
          { status: 400 }
        );
      }

      // Máximo 12MB por imagen
      if (file.size > 12 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: `El archivo "${originalName}" supera el límite máximo de 12MB.`,
          },
          { status: 400 }
        );
      }

      // Sanitizar el nombre base
      const cleanBase = path
        .basename(originalName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .slice(0, 30);
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const safeFilename = `${cleanBase || "slide"}_${uniqueSuffix}${ext}`;
      const targetFilePath = path.join(uploadDir, safeFilename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(targetFilePath, buffer);

      uploadedResults.push({
        filename: safeFilename,
        url: `/${targetFolder}/${safeFilename}`,
        originalName,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        uploadedResults.length === 1
          ? "Imagen subida exitosamente."
          : `${uploadedResults.length} imágenes subidas exitosamente.`,
      files: uploadedResults,
      filename: uploadedResults[0].filename,
      url: uploadedResults[0].url,
    });
  } catch (error: any) {
    console.error("Error al subir archivo en /api/admin/upload:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la subida del archivo.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
