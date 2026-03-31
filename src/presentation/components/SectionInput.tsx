import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTextInputSubmit } from '../hooks/useTextInputSubmit';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { BORDER_RADIUS_SM, DISABLED_OPACITY } from '../theme/styleConstants';

interface SectionInputProps {
  onAdd: (title: string) => void;
}

export const SectionInput = ({ onAdd }: SectionInputProps) => {
  const { inputText, setInputText, inputRef, handleSubmit, isInputEmpty } =
    useTextInputSubmit({ onSubmit: onAdd });

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
    borderRadius: BORDER_RADIUS_SM,
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
    opacity: DISABLED_OPACITY,
  },
});
