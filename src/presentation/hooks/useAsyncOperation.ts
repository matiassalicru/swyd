import { useCallback, useState } from 'react';

interface UseAsyncOperationReturn {
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
  execute: (
    operation: () => Promise<void>,
    fallbackErrorMessage?: string
  ) => Promise<void>;
}

export const useAsyncOperation = (
  refreshData: () => Promise<void>
): UseAsyncOperationReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const execute = useCallback(
    async (
      operation: () => Promise<void>,
      fallbackErrorMessage: string = 'Operation failed'
    ) => {
      setError(null);
      setIsSaving(true);
      try {
        await operation();
        await refreshData();
      } catch (caughtError) {
        const errorMessage =
          caughtError instanceof Error
            ? caughtError.message
            : fallbackErrorMessage;
        setError(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [refreshData]
  );

  return {
    isSaving,
    error,
    clearError,
    execute,
  };
};
