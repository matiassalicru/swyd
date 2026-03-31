import { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_SECTION_ID } from '../../data/local/database';
import { groupTodosBySection } from '../utils/groupTodos';
import { AddSectionFAB } from '../components/AddSectionFAB';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { TodoInput } from '../components/TodoInput';
import { TodoSection } from '../components/TodoSection';
import { useCollapsedSections } from '../hooks/useCollapsedSections';
import { useTodos } from '../hooks/useTodos';
import { useSections } from '../hooks/useSections';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const TodoListScreen = () => {
  const [selectedSectionId, setSelectedSectionId] = useState(DEFAULT_SECTION_ID);

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
  } = useTodos();

  const {
    sections,
    isLoading: isSectionsLoading,
    error: sectionsError,
    addSection,
    deleteSection,
  } = useSections();

  const { isSectionCollapsed, toggleCollapse } = useCollapsedSections();
  const safeAreaInsets = useSafeAreaInsets();

  const isLoading = isTodosLoading || isSectionsLoading;
  const error = todosError ?? sectionsError;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const hasCustomSections = sections.length > 1;
  const showGlobalEmptyState = totalCount === 0 && !hasCustomSections;
  const sectionedData = groupTodosBySection(todos, sections);

  const handleAddTodo = useCallback(
    (title: string, sectionId: number) => {
      addTodo(title, sectionId);
    },
    [addTodo]
  );

  const handleSectionChange = useCallback((sectionId: number) => {
    setSelectedSectionId(sectionId);
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
      <ScreenHeader
        completedCount={completedCount}
        totalCount={totalCount}
        style={{ paddingTop: safeAreaInsets.top + spacing.md }}
      />

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
            sectionedData.map((sectionWithTodos) => (
              <TodoSection
                key={sectionWithTodos.section.id}
                section={sectionWithTodos.section}
                todos={sectionWithTodos.todos}
                isCollapsed={isSectionCollapsed(sectionWithTodos.section.id)}
                sections={sections}
                onToggleCollapse={toggleCollapse}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
                onEditTodo={updateTodoTitle}
                onMoveTodo={moveTodoToSection}
                onDeleteSection={deleteSection}
              />
            ))
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
