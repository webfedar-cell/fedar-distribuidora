import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";

interface UsuarioRow {
  US_ID: number;
  US_NOMBRE: string;
  US_ACCESO: number;
  NI_DENOMINACION?: string;
}

// GET: Listar todos los usuarios administradores
export async function GET() {
  try {
    const users = await query<UsuarioRow>(
      `SELECT a.US_ID, a.US_NOMBRE, a.US_ACCESO, COALESCE(b.NI_DENOMINACION, 'Administrador') AS NI_DENOMINACION 
       FROM USUARIOS a 
       LEFT JOIN NIVELES b ON b.NI_ID = a.US_ACCESO 
       ORDER BY a.US_ID DESC`
    );

    const levels = await query(`SELECT NI_ID, NI_DENOMINACION FROM NIVELES ORDER BY NI_ID ASC`);

    return NextResponse.json({
      success: true,
      users,
      levels,
    });
  } catch (error: any) {
    console.error("Error al listar usuarios:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener usuarios.", error: error?.message },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo usuario administrador
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, acceso } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "El correo electrónico y la contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Verificar si ya existe
    const existing = await query(
      "SELECT US_ID FROM USUARIOS WHERE LOWER(US_NOMBRE) = ? LIMIT 1",
      [trimmedEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Ya existe un usuario con este correo electrónico." },
        { status: 400 }
      );
    }

    const passwordHash = crypto.createHash("md5").update(password.trim()).digest("hex");
    const userAcceso = Number(acceso) || 1;

    const result: any = await query(
      "INSERT INTO USUARIOS (US_NOMBRE, US_CONTRASENA, US_ACCESO) VALUES (?, ?, ?)",
      [trimmedEmail, passwordHash, userAcceso]
    );

    return NextResponse.json({
      success: true,
      message: "Usuario creado correctamente.",
      userId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear usuario.", error: error?.message },
      { status: 500 }
    );
  }
}
