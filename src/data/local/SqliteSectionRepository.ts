import { type SQLiteDatabase } from 'expo-sqlite';

import { Section } from '../../domain/models/Section';
import { SectionRepository } from '../../domain/repositories/SectionRepository';
import { DEFAULT_SECTION_ID } from './database';

interface SectionRow {
  id: number;
  title: string;
  position: number;
}

const mapRowToSection = (row: SectionRow): Section => {
  return {
    id: row.id,
    title: row.title,
    position: row.position,
  };
};

export class SqliteSectionRepository implements SectionRepository {
  constructor(private database: SQLiteDatabase) {}

  async getAll(): Promise<Section[]> {
    const rows = await this.database.getAllAsync<SectionRow>(
      'SELECT id, title, position FROM sections ORDER BY position ASC'
    );

    return rows.map(mapRowToSection);
  }

  async create(title: string): Promise<Section> {
    const maxPositionResult = await this.database.getFirstAsync<{ max_position: number | null }>(
      'SELECT MAX(position) as max_position FROM sections'
    );

    const nextPosition = (maxPositionResult?.max_position ?? -1) + 1;

    const result = await this.database.runAsync(
      'INSERT INTO sections (title, position) VALUES (?, ?)',
      title,
      nextPosition
    );

    return {
      id: result.lastInsertRowId,
      title,
      position: nextPosition,
    };
  }

  async rename(id: number, title: string): Promise<void> {
    await this.database.runAsync(
      'UPDATE sections SET title = ? WHERE id = ?',
      title,
      id
    );
  }

  async remove(id: number): Promise<void> {
    if (id === DEFAULT_SECTION_ID) {
      throw new Error('Cannot delete the default section');
    }

    await this.database.withExclusiveTransactionAsync(async (transaction) => {
      // Reassign all todos from the removed section to the default section
      // Place them at the end of the default section's position list
      const maxPositionResult = await transaction.getFirstAsync<{ max_position: number | null }>(
        'SELECT MAX(position) as max_position FROM todos WHERE section_id = ?',
        DEFAULT_SECTION_ID
      );

      let currentPosition = (maxPositionResult?.max_position ?? -1) + 1;

      const orphanedTodos = await transaction.getAllAsync<{ id: number }>(
        'SELECT id FROM todos WHERE section_id = ? ORDER BY position ASC',
        id
      );

      for (const orphanedTodo of orphanedTodos) {
        await transaction.runAsync(
          'UPDATE todos SET section_id = ?, position = ? WHERE id = ?',
          DEFAULT_SECTION_ID,
          currentPosition,
          orphanedTodo.id
        );
        currentPosition += 1;
      }

      // Delete the section
      await transaction.runAsync('DELETE FROM sections WHERE id = ?', id);
    });
  }

  async reorder(orderedIds: number[]): Promise<void> {
    await this.database.withExclusiveTransactionAsync(async (transaction) => {
      for (const [newPosition, sectionId] of orderedIds.entries()) {
        await transaction.runAsync(
          'UPDATE sections SET position = ? WHERE id = ?',
          newPosition,
          sectionId
        );
      }
    });
  }
}
