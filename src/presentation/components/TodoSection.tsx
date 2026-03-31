import { StyleSheet, View } from 'react-native';

import { DEFAULT_SECTION_ID } from '../../data/local/database';
import { Section } from '../../domain/models/Section';
import { Todo } from '../../domain/models/Todo';
import { EmptySectionState } from './EmptySectionState';
import { SectionHeader } from './SectionHeader';
import { TodoItem } from './TodoItem';
import { spacing } from '../theme/spacing';

interface TodoSectionProps {
  section: Section;
  todos: Todo[];
  isCollapsed: boolean;
  sections: Section[];
  onToggleCollapse: (sectionId: number) => void;
  onToggleTodo: (todoId: number) => void;
  onDeleteTodo: (todoId: number) => void;
  onEditTodo: (todoId: number, newTitle: string) => void;
  onMoveTodo: (todoId: number, targetSectionId: number) => void;
  onDeleteSection: (sectionId: number) => void;
}

export const TodoSection = ({
  section,
  todos,
  isCollapsed,
  sections,
  onToggleCollapse,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onMoveTodo,
  onDeleteSection,
}: TodoSectionProps) => {
  const isDefaultSection = section.id === DEFAULT_SECTION_ID;

  return (
    <View style={styles.sectionBlock}>
      <SectionHeader
        section={section}
        todoCount={todos.length}
        isCollapsed={isCollapsed}
        isDefault={isDefaultSection}
        onToggleCollapse={() => onToggleCollapse(section.id)}
        onDeleteSection={
          !isDefaultSection ? () => onDeleteSection(section.id) : undefined
        }
      />

      {!isCollapsed && (
        todos.length === 0 ? (
          <EmptySectionState />
        ) : (
          <View style={styles.todoListWrapper}>
            {todos.map((todo, todoIndex) => (
              <View key={todo.id}>
                {todoIndex > 0 && <View style={styles.todoSeparator} />}
                <TodoItem
                  todo={todo}
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
                  onEdit={onEditTodo}
                  onMove={onMoveTodo}
                  sections={sections}
                  currentSectionId={section.id}
                />
              </View>
            ))}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
