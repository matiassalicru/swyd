import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ScreenHeaderProps {
  completedCount: number;
  totalCount: number;
  style?: ViewStyle;
}

export const ScreenHeader = ({ completedCount, totalCount, style }: ScreenHeaderProps) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={styles.headerTitle}>Swyd</Text>
      {totalCount > 0 && (
        <Text style={styles.headerCount}>
          {completedCount}/{totalCount} completed
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.surface,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
