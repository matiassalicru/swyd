import { type SQLiteDatabase } from 'expo-sqlite';

import { Todo } from '../../domain/models/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

interface TodoRow {
  id: number;
  title: string;
  completed: number;
  created_at: number;
  section_id: number;
  position: number;
}

const mapRowToTodo = (row: TodoRow): Todo => {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
    sectionId: row.section_id,
    position: row.position,
  };
};

export class SqliteTodoRepository implements TodoRepository {
  constructor(private database: SQLiteDatabase) {}

  async getAll(): Promise<Todo[]> {
    const rows = await this.database.getAllAsync<TodoRow>(
      `SELECT t.id, t.title, t.completed, t.created_at, t.section_id, t.position
       FROM todos t
       JOIN sections s ON t.section_id = s.id
       ORDER BY s.position ASC, t.position ASC`
    );

    return rows.map(mapRowToTodo);
  }

  async getAllBySection(sectionId: number): Promise<Todo[]> {
    const rows = await this.database.getAllAsync<TodoRow>(
      `SELECT id, title, completed, created_at, section_id, position
       FROM todos
       WHERE section_id = ?
       ORDER BY position ASC`,
      sectionId
    );

    return rows.map(mapRowToTodo);
  }

  async create(title: string, sectionId: number): Promise<Todo> {
    const createdAt = Date.now();

    const maxPositionResult = await this.database.getFirstAsync<{ max_position: number | null }>(
      'SELECT MAX(position) as max_position FROM todos WHERE section_id = ?',
      sectionId
    );

    const nextPosition = (maxPositionResult?.max_position ?? -1) + 1;

    const result = await this.database.runAsync(
      'INSERT INTO todos (title, completed, created_at, section_id, position) VALUES (?, ?, ?, ?, ?)',
      title,
      0,
      createdAt,
      sectionId,
      nextPosition
    );

    return {
      id: result.lastInsertRowId,
      title,
      completed: false,
      createdAt,
      sectionId,
      position: nextPosition,
    };
  }

  async toggleComplete(id: number): Promise<void> {
    await this.database.runAsync(
      'UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = ?',
      id
    );
  }

  async remove(id: number): Promise<void> {
    await this.database.runAsync('DELETE FROM todos WHERE id = ?', id);
  }

  async updateTitle(todoId: number, newTitle: string): Promise<void> {
    await this.database.runAsync('UPDATE todos SET title = ? WHERE id = ?', newTitle, todoId);
  }

  async moveToSection(todoId: number, targetSectionId: number): Promise<void> {
    await this.database.withExclusiveTransactionAsync(async (transaction) => {
      const maxPositionResult = await transaction.getFirstAsync<{ max_position: number | null }>(
        'SELECT MAX(position) as max_position FROM todos WHERE section_id = ?',
        targetSectionId
      );

      const nextPosition = (maxPositionResult?.max_position ?? -1) + 1;

      await transaction.runAsync(
        'UPDATE todos SET section_id = ?, position = ? WHERE id = ?',
        targetSectionId,
        nextPosition,
        todoId
      );
    });
  }
}
