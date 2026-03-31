import { type SQLiteDatabase } from 'expo-sqlite';

export const DEFAULT_SECTION_ID = 1;

const getUserVersion = async (database: SQLiteDatabase): Promise<number> => {
  const result = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  return result?.user_version ?? 0;
};

const migrateToVersion1 = async (database: SQLiteDatabase): Promise<void> => {
  // Create sections table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);

  // Insert default section if it doesn't already exist
  const existingDefault = await database.getFirstAsync<{ id: number }>(
    'SELECT id FROM sections WHERE id = ?',
    DEFAULT_SECTION_ID
  );

  if (!existingDefault) {
    await database.runAsync(
      'INSERT INTO sections (id, title, position) VALUES (?, ?, ?)',
      DEFAULT_SECTION_ID,
      'General',
      0
    );
  }

  // Add section_id column to todos (try/catch because ALTER TABLE ADD COLUMN
  // does not support IF NOT EXISTS in SQLite)
  try {
    await database.runAsync(
      `ALTER TABLE todos ADD COLUMN section_id INTEGER NOT NULL DEFAULT ${DEFAULT_SECTION_ID} REFERENCES sections(id)`
    );
  } catch (_columnAlreadyExistsError) {
    // Column already exists — safe to ignore
  }

  // Add position column to todos
  try {
    await database.runAsync(
      'ALTER TABLE todos ADD COLUMN position INTEGER NOT NULL DEFAULT 0'
    );
  } catch (_columnAlreadyExistsError) {
    // Column already exists — safe to ignore
  }

  // Backfill positions for existing todos ordered by created_at DESC
  // so that the most recently created todo gets position 0 (top of list),
  // preserving the current display order.
  const existingTodos = await database.getAllAsync<{ id: number }>(
    'SELECT id FROM todos ORDER BY created_at DESC'
  );

  for (const [todoIndex, todo] of existingTodos.entries()) {
    await database.runAsync(
      'UPDATE todos SET section_id = ?, position = ? WHERE id = ?',
      DEFAULT_SECTION_ID,
      todoIndex,
      todo.id
    );
  }

  // Set user_version LAST — it's not transactional in SQLite
  await database.execAsync('PRAGMA user_version = 1');
};

const runMigrations = async (database: SQLiteDatabase): Promise<void> => {
  const currentVersion = await getUserVersion(database);

  if (currentVersion < 1) {
    await migrateToVersion1(database);
  }
};

export const initializeDatabase = async (database: SQLiteDatabase): Promise<void> => {
  // Create base tables (idempotent)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  await runMigrations(database);
};
