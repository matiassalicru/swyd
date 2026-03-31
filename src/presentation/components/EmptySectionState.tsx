import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const EmptySectionState = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={32} color={colors.textSecondary} />
      <Text style={styles.text}>No hay tareas en esta sección</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
