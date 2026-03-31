import { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_SECTION_ID } from '../../data/local/database';
import { groupTodosBySection, SectionWithTodos } from '../utils/groupTodos';
import { EmptyState } from '../components/EmptyState';
import { EmptySectionState } from '../components/EmptySectionState';
import { SectionHeader } from '../components/SectionHeader';
import { AddSectionFAB } from '../components/AddSectionFAB';
import { TodoInput } from '../components/TodoInput';
import { TodoItem } from '../components/TodoItem';
import { useTodos } from '../hooks/useTodos';
import { useSections } from '../hooks/useSections';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const TodoListScreen = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(DEFAULT_SECTION_ID);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const {
    todos,
    isLoading: isTodosLoading,
    isSaving: isTodosSaving,
    error: todosError,
    addTodo,
    toggleTodo,
    deleteTodo,
    moveTodoToSection,
    updateTodoTitle,
    refreshTodos,
  } = useTodos();

  const {
    sections,
    isLoading: isSectionsLoading,
    error: sectionsError,
    addSection,
    deleteSection,
  } = useSections(refreshTodos);

  const safeAreaInsets = useSafeAreaInsets();

  const isLoading = isTodosLoading || isSectionsLoading;
  const error = todosError ?? sectionsError;

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const hasCustomSections = sections.length > 1;
  const showGlobalEmptyState = todos.length === 0 && !hasCustomSections;

  const sectionedData: SectionWithTodos[] = groupTodosBySection(todos, sections);

  const handleAddTodo = useCallback(
    (title: string, sectionId: number) => {
      addTodo(title, sectionId);
    },
    [addTodo]
  );

  const handleSectionChange = useCallback((sectionId: number) => {
    setSelectedSectionId(sectionId);
  }, []);

  const toggleSectionCollapse = useCallback((sectionId: number) => {
    setCollapsedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: safeAreaInsets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Swyd</Text>
        {totalCount > 0 && (
          <Text style={styles.headerCount}>
            {completedCount}/{totalCount} completed
          </Text>
        )}
      </View>

      {error !== null && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TodoInput
          onAdd={handleAddTodo}
          sections={sections}
          selectedSectionId={selectedSectionId}
          onSectionChange={handleSectionChange}
          disabled={isTodosSaving}
        />

        {showGlobalEmptyState ? (
          <EmptyState />
        ) : (
          sectionedData.map((sectionWithTodos) => {
            const sectionId = sectionWithTodos.section.id;
            const isCollapsed = !!collapsedSections[sectionId];
            const isDefaultSection = sectionId === DEFAULT_SECTION_ID;

            return (
              <View key={sectionId} style={styles.sectionBlock}>
                <SectionHeader
                  section={sectionWithTodos.section}
                  todoCount={sectionWithTodos.todos.length}
                  isCollapsed={isCollapsed}
                  isDefault={isDefaultSection}
                  onToggleCollapse={() => toggleSectionCollapse(sectionId)}
                  onDeleteSection={
                    !isDefaultSection ? () => deleteSection(sectionId) : undefined
                  }
                />

                {!isCollapsed && (
                  sectionWithTodos.todos.length === 0 ? (
                    <EmptySectionState />
                  ) : (
                    <View style={styles.todoListWrapper}>
                      {sectionWithTodos.todos.map((todo, todoIndex) => (
                        <View key={todo.id}>
                          {todoIndex > 0 && <View style={styles.todoSeparator} />}
                          <TodoItem
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={updateTodoTitle}
                            onMove={moveTodoToSection}
                            sections={sections}
                            currentSectionId={sectionId}
                          />
                        </View>
                      ))}
                    </View>
                  )
                )}
              </View>
            );
          })
        )}

      </ScrollView>
      </KeyboardAvoidingView>

      <AddSectionFAB onAdd={addSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.surface,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 96,
  },
  sectionBlock: {
    marginTop: spacing.sm,
  },
  todoListWrapper: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  todoSeparator: {
    height: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '400',
  },
});
