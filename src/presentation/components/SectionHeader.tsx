import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Section } from '../../domain/models/Section';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SectionHeaderProps {
  section: Section;
  todoCount: number;
  isCollapsed: boolean;
  isDefault: boolean;
  onToggleCollapse: () => void;
  onDeleteSection?: () => void;
}

export const SectionHeader = ({
  section,
  todoCount,
  isCollapsed,
  isDefault,
  onToggleCollapse,
  onDeleteSection,
}: SectionHeaderProps) => {
  const taskLabel = todoCount === 1 ? 'tarea' : 'tareas';

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.collapseArea}
        onPress={onToggleCollapse}
        accessibilityRole="button"
        accessibilityLabel={isCollapsed ? 'Expand section' : 'Collapse section'}
      >
        <Ionicons
          name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
          size={18}
          color={colors.textSecondary}
        />
        <Text style={styles.title}>{section.title}</Text>
        <Text style={styles.count}>
          {todoCount} {taskLabel}
        </Text>
      </Pressable>

      {!isDefault && onDeleteSection && (
        <Pressable
          style={styles.deleteButton}
          onPress={onDeleteSection}
          accessibilityRole="button"
          accessibilityLabel="Delete section"
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  collapseArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  count: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
