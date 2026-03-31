import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Section } from '../../domain/models/Section';
import { useTextInputSubmit } from '../hooks/useTextInputSubmit';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { BORDER_RADIUS_SM, DISABLED_OPACITY } from '../theme/styleConstants';

interface TodoInputProps {
  onAdd: (title: string, sectionId: number) => void;
  sections: Section[];
  selectedSectionId: number;
  onSectionChange: (sectionId: number) => void;
  disabled?: boolean;
}

export const TodoInput = ({
  onAdd,
  sections,
  selectedSectionId,
  onSectionChange,
  disabled = false,
}: TodoInputProps) => {
  const handleAdd = useCallback(
    (trimmedText: string) => onAdd(trimmedText, selectedSectionId),
    [onAdd, selectedSectionId],
  );

  const { inputText, setInputText, inputRef, handleSubmit, isInputEmpty } =
    useTextInputSubmit({ onSubmit: handleAdd });

  const isButtonDisabled = disabled || isInputEmpty;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="done"
          blurOnSubmit={false}
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Task title input"
        />
        <Pressable
          style={[styles.addButton, isButtonDisabled && styles.addButtonDisabled]}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          accessibilityRole="button"
          accessibilityLabel="Add task"
        >
          <Ionicons
            name="add"
            size={28}
            color={colors.surface}
          />
        </Pressable>
      </View>

      {sections.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {sections.map((section) => {
            const isSelected = section.id === selectedSectionId;

            return (
              <Pressable
                key={section.id}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
                onPress={() => onSectionChange(section.id)}
                accessibilityRole="button"
                accessibilityLabel={`Sección ${section.title}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
                  {section.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS_SM,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputDisabled: {
    opacity: DISABLED_OPACITY,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: DISABLED_OPACITY,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.surface,
  },
});
