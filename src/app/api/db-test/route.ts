import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db";

export async function GET() {
  const result = await testConnection();

  if (result.success) {
    return NextResponse.json({
      status: "connected",
      message: result.message,
      config: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "root",
        database: process.env.DB_NAME || "fedar_distribuidora",
      },
    });
  }

  return NextResponse.json(
    {
      status: "error",
      message: result.message,
      tip: "Verifique que el servicio de MySQL esté iniciado (ej. en XAMPP, WAMP o Docker) y que las credenciales en .env.local sean correctas.",
    },
    { status: 500 }
  );
}
