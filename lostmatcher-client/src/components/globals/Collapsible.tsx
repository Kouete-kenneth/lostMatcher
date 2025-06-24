import React, { useState } from 'react';
import { TouchableOpacity, View, LayoutAnimation, Platform, UIManager, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/components/ui/ThemedText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

export function Collapsible({ title, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.header}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText>{open ? '▲' : '▼'}</ThemedText>
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  content: { marginTop: 8 },
});