import { Todo } from '../../domain/models/Todo';
import { Section } from '../../domain/models/Section';

export interface SectionWithTodos {
  section: Section;
  todos: Todo[];
}

export const groupTodosBySection = (
  todos: Todo[],
  sections: Section[]
): SectionWithTodos[] => {
  // Build a map of sectionId -> todos for efficient lookup
  const todosBySectionId = new Map<number, Todo[]>();

  for (const todo of todos) {
    const existingTodos = todosBySectionId.get(todo.sectionId) ?? [];
    existingTodos.push(todo);
    todosBySectionId.set(todo.sectionId, existingTodos);
  }

  // Sort sections by position, then attach their todos (also sorted by position)
  const sortedSections = [...sections].sort(
    (first, second) => first.position - second.position
  );

  return sortedSections.map((section) => {
    const sectionTodos = todosBySectionId.get(section.id) ?? [];
    const sortedTodos = [...sectionTodos].sort(
      (first, second) => first.position - second.position
    );

    return {
      section,
      todos: sortedTodos,
    };
  });
};
