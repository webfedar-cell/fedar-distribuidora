import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, phone, email, location, interest, message } = body;

    try {
      await query(
        `INSERT INTO consultas_contacto (nombre, comercio, telefono, email, localidad, motivo, mensaje)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, businessName, phone, email || null, location, interest, message || null]
      );
    } catch (dbError) {
      console.warn("Could not save to MySQL (continuing anyway):", dbError);
    }

    return NextResponse.json({ success: true, message: "Consulta recibida con éxito" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
