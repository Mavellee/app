// Safe-area insets come from the native side; tests get fixed values instead.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
