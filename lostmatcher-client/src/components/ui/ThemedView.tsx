import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Colors } from '@/src/constants/Colors';

export function ThemedView({ style, ...props }: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View
      style={[
        { backgroundColor: Colors[colorScheme].background, flex: 1 },
        style,
      ]}
      {...props}
    />
  );
}