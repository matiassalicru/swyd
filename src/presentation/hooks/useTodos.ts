import { useCallback, useEffect, useState } from 'react';

import { Todo } from '../../domain/models/Todo';
import { useTodoRepository } from '../../di/RepositoryContext';
import { DEFAULT_SECTION_ID } from '../../data/local/database';
import { useAsyncOperation } from './useAsyncOperation';

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
  addTodo: (title: string, sectionId?: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  moveTodoToSection: (todoId: number, targetSectionId: number) => Promise<void>;
  updateTodoTitle: (todoId: number, newTitle: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const repository = useTodoRepository();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTodos = useCallback(async () => {
    const allTodos = await repository.getAll();
    setTodos(allTodos);
  }, [repository]);

  const { isSaving, error, clearError, execute } = useAsyncOperation(refreshTodos);

  useEffect(() => {
    const loadInitialTodos = async () => {
      setIsLoading(true);
      try {
        await refreshTodos();
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTodos();
  }, [refreshTodos]);

  const addTodo = useCallback(
    async (title: string, sectionId: number = DEFAULT_SECTION_ID) => {
      await execute(
        async () => { await repository.create(title, sectionId); },
        'Failed to add todo'
      );
    },
    [repository, execute]
  );

  const toggleTodo = useCallback(
    async (todoId: number) => {
      await execute(
        () => repository.toggleComplete(todoId),
        'Failed to toggle todo'
      );
    },
    [repository, execute]
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      await execute(
        () => repository.remove(todoId),
        'Failed to delete todo'
      );
    },
    [repository, execute]
  );

  const moveTodoToSection = useCallback(
    async (todoId: number, targetSectionId: number) => {
      await execute(
        () => repository.moveToSection(todoId, targetSectionId),
        'Failed to move todo'
      );
    },
    [repository, execute]
  );

  const updateTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      await execute(
        () => repository.updateTitle(todoId, newTitle),
        'Failed to update todo title'
      );
    },
    [repository, execute]
  );

  return {
    todos,
    isLoading,
    isSaving,
    error,
    clearError,
    addTodo,
    toggleTodo,
    deleteTodo,
    moveTodoToSection,
    updateTodoTitle,
    refreshTodos,
  };
};
