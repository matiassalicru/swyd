# Swyd

A task management app built with React Native and Expo. Organize your todos into collapsible sections, edit inline, and move tasks between sections with a long-press or swipe gesture. All data persists locally via SQLite.

## Features

- **Sections** -- Group todos into named sections with a default "General" section
- **Collapsible sections** -- Tap a section header to collapse or expand its todo list
- **Inline editing** -- Tap any todo title to edit it in place
- **Move between sections** -- Long-press a todo or swipe to reveal the move action
- **Swipe actions** -- Swipe left on a todo to access move and delete actions
- **Completion tracking** -- Header displays completed/total count across all sections
- **Persistence** -- All data stored locally with expo-sqlite; survives app restarts
- **Delete confirmation** -- Destructive actions require explicit confirmation via modal
- **Orphan reassignment** -- Deleting a section moves its todos back to the default section

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 (New Architecture) |
| Platform | Expo SDK 54 |
| Language | TypeScript (strict mode) |
| Persistence | expo-sqlite |
| Gestures | react-native-gesture-handler |
| Icons | @expo/vector-icons (Ionicons) |
| E2E Testing | Maestro |
| Build Service | EAS Build |

## Architecture

The project follows **Clean Architecture** with three distinct layers:

```
src/
  domain/          -- Business models and repository interfaces
    models/        -- Todo, Section
    repositories/  -- TodoRepository, SectionRepository (interfaces)

  data/            -- Concrete implementations
    local/         -- SQLite repository implementations, database init and migrations

  di/              -- Dependency injection
                   -- RepositoryContext (React Context providing repositories)

  presentation/    -- UI layer
    screens/       -- TodoListScreen
    components/    -- TodoItem, SectionHeader, TodoInput, AddSectionFAB, modals
    hooks/         -- useTodos, useSections (state management and data access)
    theme/         -- colors, spacing tokens
    utils/         -- groupTodosBySection helper
```

**Key patterns:**

- **Repository pattern** -- Domain defines interfaces (`TodoRepository`, `SectionRepository`); data layer provides SQLite implementations
- **Dependency injection via React Context** -- `RepositoryProvider` wires concrete repositories and exposes them through hooks (`useTodoRepository`, `useSectionRepository`)
- **Custom hooks as controllers** -- `useTodos` and `useSections` encapsulate all state management, loading states, error handling, and repository calls
- **Schema migrations** -- Database uses `PRAGMA user_version` for versioned migrations, keeping schema evolution safe and incremental

## Getting Started

### Prerequisites

- Node.js >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator
- [Maestro](https://maestro.mobile.dev/) (for E2E tests)

### Install

```bash
npm install
```

### Run

```bash
# Start the Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### E2E Tests

```bash
# Requires a running app instance and Maestro installed
npm run e2e
```

Test flows cover: adding todos, toggling completion, deleting todos, input validation, and a full journey with persistence verification across app relaunches.

### Build

```bash
# Android APK (preview profile)
npm run build:android
```

## Project Structure

```
.
├── App.tsx                   -- App root: providers and safe area setup
├── src/
│   ├── domain/               -- Models and repository contracts
│   ├── data/                 -- SQLite implementations
│   ├── di/                   -- React Context DI container
│   └── presentation/         -- Screens, components, hooks, theme
├── .maestro/                 -- Maestro E2E test flows
├── app.json                  -- Expo configuration
├── eas.json                  -- EAS Build profiles
└── tsconfig.json             -- TypeScript config (strict)
```

## License

MIT
