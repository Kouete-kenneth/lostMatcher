// filepath: src/components/HapticTab.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export function HapticTab({ label, ...props }: { label: string }) {
  return (
    <TouchableOpacity {...props}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}