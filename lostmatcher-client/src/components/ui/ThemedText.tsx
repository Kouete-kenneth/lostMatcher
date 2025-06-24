import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Colors } from '@/src/constants/Colors';

type ThemedTextProps = TextProps & {
  type?: 'title' | 'link' | 'default';
  children: React.ReactNode;
};

export function ThemedText({ type = 'default', style, children, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? 'light';
  let textStyle: (TextStyle | undefined)[] = [styles.default, { color: Colors[colorScheme].text }];

  if (type === 'title') {
    textStyle.push(styles.title);
  } else if (type === 'link') {
    textStyle.push({ color: Colors[colorScheme].primary, textDecorationLine: 'underline' });
  }

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});