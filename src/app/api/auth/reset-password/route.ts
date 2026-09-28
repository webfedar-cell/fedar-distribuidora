import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";
import { verifyRecoveryCode, clearRecoveryCode } from "@/lib/recoveryStore";

interface UsuarioRow {
  US_ID: number;
  US_NOMBRE: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: "La nueva contraseña debe tener al menos 4 caracteres." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validar el código de recuperación
    const isCodeValid = verifyRecoveryCode(trimmedEmail, code);
    if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "El código de verificación es inválido o ha expirado. Solicitá uno nuevo.",
        },
        { status: 400 }
      );
    }

    // Verificar que el usuario exista en USUARIOS
    const rows = await query<UsuarioRow>(
      "SELECT US_ID, US_NOMBRE FROM USUARIOS WHERE LOWER(US_NOMBRE) = ? LIMIT 1",
      [trimmedEmail]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // Calcular hash MD5 de la nueva contraseña
    const passwordHash = crypto.createHash("md5").update(newPassword.trim()).digest("hex");

    // Actualizar en MySQL
    await query(
      "UPDATE USUARIOS SET US_CONTRASENA = ? WHERE LOWER(US_NOMBRE) = ?",
      [passwordHash, trimmedEmail]
    );

    // Limpiar código usado
    clearRecoveryCode(trimmedEmail);

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente. Ya podés ingresar con tu nueva contraseña.",
    });
  } catch (error: any) {
    console.error("Error en auth reset-password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar la contraseña.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
