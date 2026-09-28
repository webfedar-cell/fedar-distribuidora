import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setRecoveryCode } from "@/lib/recoveryStore";
import { sendPasswordRecoveryEmail } from "@/lib/email";

interface UsuarioRow {
  US_ID: number;
  US_NOMBRE: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Por favor ingrese su correo electrónico de usuario." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validar si el usuario existe en la tabla USUARIOS
    const rows = await query<UsuarioRow>(
      "SELECT US_ID, US_NOMBRE FROM USUARIOS WHERE LOWER(US_NOMBRE) = ? LIMIT 1",
      [trimmedEmail]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No se encontró ningún usuario administrador registrado con ese correo.",
        },
        { status: 404 }
      );
    }

    const userEmail = rows[0].US_NOMBRE;

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryCode(trimmedEmail, code);

    // Intentar enviar el correo mediante Banahosting SMTP si está configurado
    let emailSent = false;
    let emailError: string | undefined = undefined;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const emailResult = await sendPasswordRecoveryEmail(userEmail, code);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
        console.warn("Fallo el envío por SMTP Banahosting:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? `Se ha enviado un correo con el código de recuperación a ${userEmail}.`
        : `Código de recuperación generado para ${userEmail}.`,
      emailSent,
      // Si las credenciales SMTP aún no se han configurado o falló el envío, devolvemos el código en pantalla para permitir la recuperación
      code: !emailSent ? code : undefined,
    });
  } catch (error: any) {
    console.error("Error en auth recover:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la solicitud de recuperación.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
