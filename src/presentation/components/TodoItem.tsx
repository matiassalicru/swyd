import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Section } from '../../domain/models/Section';
import { Todo } from '../../domain/models/Todo';
import { ConfirmationModal } from './ConfirmationModal';
import { EditableTitle } from './EditableTitle';
import { MoveSectionModal } from './MoveSectionModal';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todoId: number, newTitle: string) => void;
  onMove: (todoId: number, targetSectionId: number) => void;
  sections: Section[];
  currentSectionId: number;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit, onMove, sections, currentSectionId }: TodoItemProps) => {
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(todo.id);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalVisible(true);
    swipeableRef.current?.close();
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onDelete(todo.id);
  };

  const handleSaveTitle = (newTitle: string) => {
    onEdit(todo.id, newTitle);
  };

  const handleLongPress = () => {
    if (sections.length <= 1) {
      return;
    }

    setIsMoveModalVisible(true);
  };

  const handleOpenMoveModal = () => {
    setIsMoveModalVisible(true);
    swipeableRef.current?.close();
  };

  const handleMoveToSection = (targetSectionId: number) => {
    onMove(todo.id, targetSectionId);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActionsContainer}>
        {sections.length > 1 && (
          <Pressable style={styles.moveAction} onPress={handleOpenMoveModal}>
            <Ionicons name="arrow-redo-outline" size={22} color={colors.surface} />
            <Text style={styles.actionLabel}>Mover</Text>
          </Pressable>
        )}
        <Pressable style={styles.deleteAction} onPress={handleOpenDeleteModal}>
          <Ionicons name="trash-outline" size={22} color={colors.surface} />
          <Text style={styles.actionLabel}>Eliminar</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
      >
        <Pressable
          onLongPress={handleLongPress}
          style={styles.container}
        >
          <Pressable
            style={styles.checkboxArea}
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: todo.completed }}
            accessibilityLabel={`Toggle ${todo.title}`}
          >
            <View style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}>
              {todo.completed && (
                <Ionicons name="checkmark" size={16} color={colors.surface} />
              )}
            </View>
          </Pressable>

          <EditableTitle
            title={todo.title}
            isCompleted={todo.completed}
            onSave={handleSaveTitle}
          />
        </Pressable>
      </Swipeable>

      <MoveSectionModal
        visible={isMoveModalVisible}
        onClose={() => setIsMoveModalVisible(false)}
        onSelect={handleMoveToSection}
        sections={sections}
        currentSectionId={currentSectionId}
        todoTitle={todo.title}
      />

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Eliminar tarea"
        message={`¿Estás seguro de que querés eliminar "${todo.title}"?`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    paddingLeft: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    minHeight: 56,
  },
  checkboxArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  rightActionsContainer: {
    flexDirection: 'row',
  },
  moveAction: {
    width: 70,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: {
    width: 70,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.surface,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
