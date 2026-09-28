import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";

// PUT: Actualizar usuario administrador
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { email, password, acceso } = body;

    const userId = Number(id);
    if (!userId) {
      return NextResponse.json({ success: false, message: "ID de usuario inválido." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ success: false, message: "El correo es obligatorio." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userAcceso = Number(acceso) !== undefined ? Number(acceso) : 1;

    // Si se especificó una nueva contraseña, actualizarla con MD5
    if (password && password.trim().length > 0) {
      const passwordHash = crypto.createHash("md5").update(password.trim()).digest("hex");
      await query(
        "UPDATE USUARIOS SET US_NOMBRE = ?, US_CONTRASENA = ?, US_ACCESO = ? WHERE US_ID = ?",
        [trimmedEmail, passwordHash, userAcceso, userId]
      );
    } else {
      // Mantener contraseña existente
      await query(
        "UPDATE USUARIOS SET US_NOMBRE = ?, US_ACCESO = ? WHERE US_ID = ?",
        [trimmedEmail, userAcceso, userId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar usuario.", error: error?.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar usuario administrador
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (!userId) {
      return NextResponse.json({ success: false, message: "ID de usuario inválido." }, { status: 400 });
    }

    // Verificar que no sea el último usuario para evitar bloqueo total
    const totalUsers: any = await query("SELECT COUNT(*) AS total FROM USUARIOS");
    if (totalUsers[0]?.total <= 1) {
      return NextResponse.json(
        { success: false, message: "No se puede eliminar el único usuario administrador existente." },
        { status: 400 }
      );
    }

    await query("DELETE FROM USUARIOS WHERE US_ID = ?", [userId]);

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente.",
    });
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar usuario.", error: error?.message },
      { status: 500 }
    );
  }
}
