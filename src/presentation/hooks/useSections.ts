import { useCallback, useEffect, useState } from 'react';

import { Section } from '../../domain/models/Section';
import { useSectionRepository } from '../../di/RepositoryContext';
import { useAsyncOperation } from './useAsyncOperation';

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

export const useSections = (
  onSectionDeleted?: () => void
): UseSectionsReturn => {
  const repository = useSectionRepository();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSections = useCallback(async () => {
    const allSections = await repository.getAll();
    setSections(allSections);
  }, [repository]);

  const { isSaving, error, clearError, execute } = useAsyncOperation(refreshSections);

  useEffect(() => {
    const loadInitialSections = async () => {
      setIsLoading(true);
      try {
        await refreshSections();
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSections();
  }, [refreshSections]);

  const addSection = useCallback(
    async (title: string) => {
      await execute(
        async () => { await repository.create(title); },
        'Failed to add section'
      );
    },
    [repository, execute]
  );

  const renameSection = useCallback(
    async (sectionId: number, title: string) => {
      await execute(
        async () => { await repository.rename(sectionId, title); },
        'Failed to rename section'
      );
    },
    [repository, execute]
  );

  const deleteSection = useCallback(
    async (sectionId: number) => {
      await execute(
        async () => {
          await repository.remove(sectionId);
          // Signal that todos need refresh since orphaned todos moved to default section
          onSectionDeleted?.();
        },
        'Failed to delete section'
      );
    },
    [repository, execute, onSectionDeleted]
  );

  const reorderSections = useCallback(
    (reorderedSections: Section[]) => {
      // Optimistic update: set state immediately
      const previousSections = sections;

      const updatedSections = reorderedSections.map((section, position) => ({
        ...section,
        position,
      }));

      setSections(updatedSections);

      // Persist in background — on failure, try to refresh from server or revert
      const orderedIds = reorderedSections.map((section) => section.id);
      repository.reorder(orderedIds).catch(async () => {
        try {
          await refreshSections();
        } catch (_refreshError) {
          // If refresh also fails, revert to previous state
          setSections(previousSections);
        }
      });
    },
    [sections, repository, refreshSections]
  );

  return {
    sections,
    isLoading,
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
