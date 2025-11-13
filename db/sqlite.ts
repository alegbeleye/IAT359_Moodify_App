import * as SQLite from "expo-sqlite";

const DB_NAME = "moodly.db";
const db = SQLite.openDatabaseSync(DB_NAME);

export async function runSql(sql: string, params: any[] = []): Promise<any> {
  try {
    let result: any = undefined;

    await db.withTransactionAsync(async () => {
      // assign result but do NOT return it from the transaction callback
      result = await db.runAsync(sql, params);
    });

    //  return the captured result after the transaction completes
    return result;
  } catch (err) {
    console.error("runSql error", err);
    throw err;
  }
}

export async function getAll(sql: string, params: any[] = []): Promise<any[]> {
  try {
    return await db.getAllAsync(sql, params);
  } catch (err) {
    console.error("getAll error", err);
    throw err;
  }
}

/* DB API */
export type UserRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: number;
};

export async function initDB(): Promise<void> {
  await runSql(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      created_at INTEGER
    );`
  );
}

export async function createUser({
  username,
  passwordHash,
}: {
  username: string;
  passwordHash: string;
}): Promise<number> {
  const ts = Date.now();
  const res: any = await runSql(
    `INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?);`,
    [username, passwordHash, ts]
  );
  return res?.insertId ?? -1;
}

export async function findUserByUsername(
  username: string
): Promise<UserRow | null> {
  const rows = await getAll(`SELECT * FROM users WHERE username = ? LIMIT 1;`, [
    username,
  ]);
  if (rows.length > 0) return rows[0] as UserRow;
  return null;
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const rows = await getAll(`SELECT * FROM users WHERE id = ? LIMIT 1;`, [id]);
  if (rows.length > 0) return rows[0] as UserRow;
  return null;
}

export async function setSession(userId: number): Promise<number> {
  await runSql(`DELETE FROM session;`);
  const ts = Date.now();
  const res: any = await runSql(
    `INSERT INTO session (user_id, created_at) VALUES (?, ?);`,
    [userId, ts]
  );
  return res?.insertId ?? -1;
}

export async function clearSession(): Promise<void> {
  await runSql(`DELETE FROM session;`);
}

export async function getSessionUserId(): Promise<number | null> {
  const rows = await getAll(`SELECT user_id FROM session LIMIT 1;`);
  if (rows.length > 0) return rows[0].user_id ?? null;
  return null;
}
