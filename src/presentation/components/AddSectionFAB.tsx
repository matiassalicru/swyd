import { useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface AddSectionFABProps {
  onAdd: (title: string) => void;
}

export const AddSectionFAB = ({ onAdd }: AddSectionFABProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const safeAreaInsets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const isTitleEmpty = sectionTitle.trim().length === 0;

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSectionTitle('');
  };

  const handleSubmit = () => {
    const trimmedTitle = sectionTitle.trim();

    if (trimmedTitle.length === 0) {
      return;
    }

    onAdd(trimmedTitle);
    setSectionTitle('');
    setIsModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.fab, { bottom: spacing.lg + safeAreaInsets.bottom }]}
        onPress={handleOpenModal}
        accessibilityRole="button"
        accessibilityLabel="Agregar sección"
      >
        <Ionicons name="add" size={28} color={colors.surface} />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
        onShow={() => inputRef.current?.focus()}
      >
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>Nueva sección</Text>

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={sectionTitle}
              onChangeText={setSectionTitle}
              placeholder="Nombre de la sección..."
              placeholderTextColor={colors.textSecondary}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              autoFocus
            />

            <View style={styles.buttonsRow}>
              <Pressable style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmButton, isTitleEmpty && styles.confirmButtonDisabled]}
                onPress={handleSubmit}
                disabled={isTitleEmpty}
              >
                <Text style={[styles.confirmButtonText, isTitleEmpty && styles.confirmButtonTextDisabled]}>
                  Crear
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    maxWidth: 320,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    backgroundColor: colors.background,
    marginTop: spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  confirmButtonTextDisabled: {
    color: colors.surface,
  },
});
