import { Todo } from '../models/Todo';

export interface TodoRepository {
  getAll(): Promise<Todo[]>; // all todos, ordered by section position then todo position
  getAllBySection(sectionId: number): Promise<Todo[]>; // ordered by position ASC
  create(title: string, sectionId: number): Promise<Todo>;
  toggleComplete(id: number): Promise<void>;
  remove(id: number): Promise<void>;
  moveToSection(todoId: number, targetSectionId: number): Promise<void>;
  updateTitle(todoId: number, newTitle: string): Promise<void>;
}
