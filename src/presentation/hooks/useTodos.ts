import { useCallback, useEffect, useState } from 'react';

import { Todo } from '../../domain/models/Todo';
import { useTodoRepository } from '../../di/RepositoryContext';
import { DEFAULT_SECTION_ID } from '../../data/local/database';

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshTodos = useCallback(async () => {
    const allTodos = await repository.getAll();
    setTodos(allTodos);
  }, [repository]);

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
      setError(null);
      setIsSaving(true);
      try {
        await repository.create(title, sectionId);
        await refreshTodos();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to add todo';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshTodos]
  );

  const toggleTodo = useCallback(
    async (id: number) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.toggleComplete(id);
        await refreshTodos();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to toggle todo';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshTodos]
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.remove(id);
        await refreshTodos();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to delete todo';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshTodos]
  );

  const moveTodoToSection = useCallback(
    async (todoId: number, targetSectionId: number) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.moveToSection(todoId, targetSectionId);
        await refreshTodos();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to move todo';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshTodos]
  );

  const updateTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.updateTitle(todoId, newTitle);
        await refreshTodos();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to update todo title';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshTodos]
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
