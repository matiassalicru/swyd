import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

const TODOS_QUERY_KEY = ['todos'] as const;

export const useTodos = (): UseTodosReturn => {
  const repository = useTodoRepository();
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => repository.getAll(),
  });

  const invalidateTodos = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
  }, [queryClient]);

  const addTodoMutation = useMutation({
    mutationFn: ({ title, sectionId }: { title: string; sectionId: number }) =>
      repository.create(title, sectionId),
    onSuccess: invalidateTodos,
  });

  const toggleTodoMutation = useMutation({
    mutationFn: (todoId: number) => repository.toggleComplete(todoId),
    onSuccess: invalidateTodos,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: number) => repository.remove(todoId),
    onSuccess: invalidateTodos,
  });

  const moveTodoToSectionMutation = useMutation({
    mutationFn: ({ todoId, targetSectionId }: { todoId: number; targetSectionId: number }) =>
      repository.moveToSection(todoId, targetSectionId),
    onSuccess: invalidateTodos,
  });

  const updateTodoTitleMutation = useMutation({
    mutationFn: ({ todoId, newTitle }: { todoId: number; newTitle: string }) =>
      repository.updateTitle(todoId, newTitle),
    onSuccess: invalidateTodos,
  });

  const isSaving =
    addTodoMutation.isPending ||
    toggleTodoMutation.isPending ||
    deleteTodoMutation.isPending ||
    moveTodoToSectionMutation.isPending ||
    updateTodoTitleMutation.isPending;

  const mutationError =
    addTodoMutation.error ??
    toggleTodoMutation.error ??
    deleteTodoMutation.error ??
    moveTodoToSectionMutation.error ??
    updateTodoTitleMutation.error;

  const queryError = todosQuery.error;
  const error = mutationError?.message ?? queryError?.message ?? null;

  const clearError = useCallback(() => {
    addTodoMutation.reset();
    toggleTodoMutation.reset();
    deleteTodoMutation.reset();
    moveTodoToSectionMutation.reset();
    updateTodoTitleMutation.reset();
  }, [addTodoMutation, toggleTodoMutation, deleteTodoMutation, moveTodoToSectionMutation, updateTodoTitleMutation]);

  const addTodo = useCallback(
    async (title: string, sectionId: number = DEFAULT_SECTION_ID) => {
      await addTodoMutation.mutateAsync({ title, sectionId });
    },
    [addTodoMutation]
  );

  const toggleTodo = useCallback(
    async (todoId: number) => {
      await toggleTodoMutation.mutateAsync(todoId);
    },
    [toggleTodoMutation]
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      await deleteTodoMutation.mutateAsync(todoId);
    },
    [deleteTodoMutation]
  );

  const moveTodoToSection = useCallback(
    async (todoId: number, targetSectionId: number) => {
      await moveTodoToSectionMutation.mutateAsync({ todoId, targetSectionId });
    },
    [moveTodoToSectionMutation]
  );

  const updateTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      await updateTodoTitleMutation.mutateAsync({ todoId, newTitle });
    },
    [updateTodoTitleMutation]
  );

  const refreshTodos = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
  }, [queryClient]);

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
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
