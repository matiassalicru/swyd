import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { TodoRepository } from '../domain/repositories/TodoRepository';
import { SectionRepository } from '../domain/repositories/SectionRepository';
import { SqliteTodoRepository } from '../data/local/SqliteTodoRepository';
import { SqliteSectionRepository } from '../data/local/SqliteSectionRepository';

interface RepositoryContextValue {
  todoRepository: TodoRepository;
  sectionRepository: SectionRepository;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

interface RepositoryProviderProps {
  children: ReactNode;
}

export const RepositoryProvider = ({ children }: RepositoryProviderProps) => {
  const database = useSQLiteContext();
  const todoRepository = useMemo(() => new SqliteTodoRepository(database), [database]);
  const sectionRepository = useMemo(() => new SqliteSectionRepository(database), [database]);

  const contextValue = useMemo<RepositoryContextValue>(
    () => ({ todoRepository, sectionRepository }),
    [todoRepository, sectionRepository]
  );

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useTodoRepository = (): TodoRepository => {
  const context = useContext(RepositoryContext);

  if (context === null) {
    throw new Error(
      'useTodoRepository must be used within a RepositoryProvider. ' +
        'Wrap your component tree with <RepositoryProvider>.'
    );
  }

  return context.todoRepository;
};

export const useSectionRepository = (): SectionRepository => {
  const context = useContext(RepositoryContext);

  if (context === null) {
    throw new Error(
      'useSectionRepository must be used within a RepositoryProvider. ' +
        'Wrap your component tree with <RepositoryProvider>.'
    );
  }

  return context.sectionRepository;
};
