import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="clipboard-outline" size={64} color={colors.border} />
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>Add your first task above to get started</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
