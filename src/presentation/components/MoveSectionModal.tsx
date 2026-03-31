import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Section } from '../../domain/models/Section';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface MoveSectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sectionId: number) => void;
  sections: Section[];
  currentSectionId: number;
  todoTitle: string;
}

export const MoveSectionModal = ({
  visible,
  onClose,
  onSelect,
  sections,
  currentSectionId,
  todoTitle,
}: MoveSectionModalProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const handleSectionPress = (sectionId: number) => {
    onSelect(sectionId);
    onClose();
  };

  const renderSectionRow = ({ item: section }: { item: Section }) => {
    const isCurrentSection = section.id === currentSectionId;

    return (
      <Pressable
        style={styles.sectionRow}
        onPress={() => !isCurrentSection && handleSectionPress(section.id)}
        disabled={isCurrentSection}
      >
        <Text
          style={[
            styles.sectionRowText,
            isCurrentSection && styles.sectionRowTextDisabled,
          ]}
        >
          {section.title}
        </Text>
        {isCurrentSection && (
          <View style={styles.currentIndicator}>
            <Text style={styles.currentLabel}>actual</Text>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
            />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.container, { paddingBottom: safeAreaInsets.bottom + spacing.md }]}
          onPress={() => {}}
        >
          <Text style={styles.title}>Mover &quot;{todoTitle}&quot; a...</Text>

          <FlatList
            data={sections}
            keyExtractor={(section) => section.id.toString()}
            renderItem={renderSectionRow}
            bounces={false}
          />

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionRowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  sectionRowTextDisabled: {
    color: colors.disabled,
  },
  currentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.disabled,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
  },
});
