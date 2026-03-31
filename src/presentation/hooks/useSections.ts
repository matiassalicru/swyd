import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Section } from '../../domain/models/Section';
import { useSectionRepository } from '../../di/RepositoryContext';

interface UseSectionsReturn {
  sections: Section[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
  addSection: (title: string) => Promise<void>;
  renameSection: (id: number, title: string) => Promise<void>;
  deleteSection: (id: number) => Promise<void>;
  reorderSections: (reorderedSections: Section[]) => void;
  refreshSections: () => Promise<void>;
}

const SECTIONS_QUERY_KEY = ['sections'] as const;
const TODOS_QUERY_KEY = ['todos'] as const;

export const useSections = (): UseSectionsReturn => {
  const repository = useSectionRepository();
  const queryClient = useQueryClient();

  const sectionsQuery = useQuery({
    queryKey: SECTIONS_QUERY_KEY,
    queryFn: () => repository.getAll(),
  });

  const invalidateSections = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY });
  }, [queryClient]);

  const invalidateSectionsAndTodos = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
    ]);
  }, [queryClient]);

  const addSectionMutation = useMutation({
    mutationFn: (title: string) => repository.create(title),
    onSuccess: invalidateSections,
  });

  const renameSectionMutation = useMutation({
    mutationFn: ({ sectionId, title }: { sectionId: number; title: string }) =>
      repository.rename(sectionId, title),
    onSuccess: invalidateSections,
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: number) => repository.remove(sectionId),
    onSuccess: invalidateSectionsAndTodos,
  });

  const isSaving =
    addSectionMutation.isPending ||
    renameSectionMutation.isPending ||
    deleteSectionMutation.isPending;

  const mutationError =
    addSectionMutation.error ??
    renameSectionMutation.error ??
    deleteSectionMutation.error;

  const queryError = sectionsQuery.error;
  const error = mutationError?.message ?? queryError?.message ?? null;

  const clearError = useCallback(() => {
    addSectionMutation.reset();
    renameSectionMutation.reset();
    deleteSectionMutation.reset();
  }, [addSectionMutation, renameSectionMutation, deleteSectionMutation]);

  const addSection = useCallback(
    async (title: string) => {
      await addSectionMutation.mutateAsync(title);
    },
    [addSectionMutation]
  );

  const renameSection = useCallback(
    async (sectionId: number, title: string) => {
      await renameSectionMutation.mutateAsync({ sectionId, title });
    },
    [renameSectionMutation]
  );

  const deleteSection = useCallback(
    async (sectionId: number) => {
      await deleteSectionMutation.mutateAsync(sectionId);
    },
    [deleteSectionMutation]
  );

  const reorderSections = useCallback(
    (reorderedSections: Section[]) => {
      const previousSections = sectionsQuery.data ?? [];

      const updatedSections = reorderedSections.map((section, position) => ({
        ...section,
        position,
      }));

      queryClient.setQueryData(SECTIONS_QUERY_KEY, updatedSections);

      const orderedIds = reorderedSections.map((section) => section.id);
      repository.reorder(orderedIds).catch(async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY });
        } catch (_refreshError) {
          queryClient.setQueryData(SECTIONS_QUERY_KEY, previousSections);
        }
      });
    },
    [sectionsQuery.data, repository, queryClient]
  );

  const refreshSections = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY });
  }, [queryClient]);

  return {
    sections: sectionsQuery.data ?? [],
    isLoading: sectionsQuery.isLoading,
    isSaving,
    error,
    clearError,
    addSection,
    renameSection,
    deleteSection,
    reorderSections,
    refreshSections,
  };
};
