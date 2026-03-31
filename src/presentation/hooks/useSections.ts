import { useCallback, useEffect, useState } from 'react';

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

export const useSections = (
  onSectionDeleted?: () => void
): UseSectionsReturn => {
  const repository = useSectionRepository();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshSections = useCallback(async () => {
    const allSections = await repository.getAll();
    setSections(allSections);
  }, [repository]);

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
      setError(null);
      setIsSaving(true);
      try {
        await repository.create(title);
        await refreshSections();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to add section';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshSections]
  );

  const renameSection = useCallback(
    async (id: number, title: string) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.rename(id, title);
        await refreshSections();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to rename section';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshSections]
  );

  const deleteSection = useCallback(
    async (id: number) => {
      setError(null);
      setIsSaving(true);
      try {
        await repository.remove(id);
        await refreshSections();
        // Signal that todos need refresh since orphaned todos moved to default section
        onSectionDeleted?.();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : 'Failed to delete section';
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [repository, refreshSections, onSectionDeleted]
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

      // Persist in background
      const orderedIds = reorderedSections.map((section) => section.id);
      repository.reorder(orderedIds).catch(async () => {
        setError('Failed to reorder sections');
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
