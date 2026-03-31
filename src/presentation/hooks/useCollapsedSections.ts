import { useCallback, useState } from 'react';

interface UseCollapsedSectionsReturn {
  collapsedSections: Set<number>;
  toggleCollapse: (sectionId: number) => void;
  isSectionCollapsed: (sectionId: number) => boolean;
}

export const useCollapsedSections = (): UseCollapsedSectionsReturn => {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(
    () => new Set()
  );

  const toggleCollapse = useCallback((sectionId: number) => {
    setCollapsedSections((previousCollapsed) => {
      const nextCollapsed = new Set(previousCollapsed);

      if (nextCollapsed.has(sectionId)) {
        nextCollapsed.delete(sectionId);
      } else {
        nextCollapsed.add(sectionId);
      }

      return nextCollapsed;
    });
  }, []);

  const isSectionCollapsed = useCallback(
    (sectionId: number): boolean => collapsedSections.has(sectionId),
    [collapsedSections]
  );

  return { collapsedSections, toggleCollapse, isSectionCollapsed };
};
