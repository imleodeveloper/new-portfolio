import mysql from "mysql2/promise";

// Pool singleton — reutilizado entre invocações do Next.js em dev e em produção
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  const required = (key: string) => {
    const v = process.env[key];
    if (!v) throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
    return v;
  };

  pool = mysql.createPool({
    host:               required("DB_HOST"),
    port:               Number(process.env.DB_PORT ?? 3306),
    database:           required("DB_NAME"),
    user:               required("DB_USER"),
    password:           required("DB_PASS"),
    waitForConnections: true,
    connectionLimit:    5,
    timezone:           "Z",
    charset:            "utf8mb4",
  });

  return pool;
}
