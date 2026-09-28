import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";

interface UsuarioRow {
  US_ID: number;
  US_NOMBRE: string;
  US_CONTRASENA: string;
  US_ACCESO: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Por favor complete todos los campos." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const passwordHash = crypto.createHash("md5").update(password.trim()).digest("hex");

    // Buscar en la tabla USUARIOS por email y hash MD5
    const rows = await query<UsuarioRow>(
      "SELECT US_ID, US_NOMBRE, US_ACCESO FROM USUARIOS WHERE LOWER(US_NOMBRE) = ? AND US_CONTRASENA = ? LIMIT 1",
      [trimmedEmail, passwordHash]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Credenciales incorrectas. Verifique el usuario y la contraseña ingresados.",
        },
        { status: 401 }
      );
    }

    const user = rows[0];

    const response = NextResponse.json({
      success: true,
      message: "Ingreso exitoso.",
      user: {
        id: user.US_ID,
        email: user.US_NOMBRE,
        acceso: user.US_ACCESO,
      },
    });

    // Guardar sesión básica en cookie
    response.cookies.set("fedar_admin_session", JSON.stringify({
      id: user.US_ID,
      email: user.US_NOMBRE,
      acceso: user.US_ACCESO,
      timestamp: Date.now(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error en auth login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar el ingreso. Intente nuevamente más tarde.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
