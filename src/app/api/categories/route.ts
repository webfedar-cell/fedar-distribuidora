import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query<any>(
      "SELECT CA_ID as id, CA_NOMBRE as name, CA_ORDEN as orden FROM `CATEGORIAS` ORDER BY CA_ORDEN ASC, CA_NOMBRE ASC"
    );

    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "mysql", data: rows });
    }

    return NextResponse.json({ success: true, source: "empty", data: [] });
  } catch (error: any) {
    // Return empty array with 200 status so client never crashes
    return NextResponse.json({ success: true, source: "fallback", data: [] });
  }
}
