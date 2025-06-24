import { useColorScheme as _useColorScheme } from 'react-native';

// Custom hook to get the current color scheme ("light" or "dark")
export function useColorScheme() {
  return _useColorScheme();
}