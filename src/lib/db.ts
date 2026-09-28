import mysql from "mysql2/promise";

// Pool singleton for Next.js
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "fedar_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
    });
  }
  return pool;
}

/**
 * Execute a SQL query with parameters using the connection pool
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Test database connection health
 */
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const db = getDbPool();
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    return { success: true, message: "Conexión a MySQL establecida correctamente." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Error al conectar con la base de datos MySQL.",
    };
  }
}
