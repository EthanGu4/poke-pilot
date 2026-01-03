import pool from "@/lib/db";

export async function authQuery<T>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

// export async function getUserFromId() {

// }