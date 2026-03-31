import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { initializeDatabase } from './src/data/local/database';
import { RepositoryProvider } from './src/di/RepositoryContext';
import { TodoListScreen } from './src/presentation/screens/TodoListScreen';
import { colors } from './src/presentation/theme/colors';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <SQLiteProvider databaseName="todos.db" onInit={initializeDatabase}>
          <RepositoryProvider>
            <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
              <TodoListScreen />
              <StatusBar style="light" />
            </SafeAreaView>
          </RepositoryProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
