import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SectionInputProps {
  onAdd: (title: string) => void;
}

export const SectionInput = ({ onAdd }: SectionInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');

  const isInputEmpty = inputText.trim().length === 0;

  const handleSubmit = () => {
    const trimmedTitle = inputText.trim();

    if (trimmedTitle.length === 0) {
      return;
    }

    onAdd(trimmedTitle);
    setInputText('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Nueva sección..."
        placeholderTextColor={colors.textSecondary}
        returnKeyType="done"
        blurOnSubmit={false}
        onSubmitEditing={handleSubmit}
        accessibilityLabel="Section title input"
      />
      <Pressable
        style={[styles.addButton, isInputEmpty && styles.addButtonDisabled]}
        onPress={handleSubmit}
        disabled={isInputEmpty}
        accessibilityRole="button"
        accessibilityLabel="Agregar sección"
      >
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={isInputEmpty ? colors.disabled : colors.primary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    backgroundColor: colors.surface,
  },
  addButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
