import React from 'react';
import { ScrollView, View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

type ParallaxScrollViewProps = {
  headerImage: React.ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
  children: React.ReactNode;
};

export default function ParallaxScrollView({
  headerImage,
  headerBackgroundColor = { light: '#fff', dark: '#222' },
  children,
}: ParallaxScrollViewProps) {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const headerHeight = 180;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            width,
            backgroundColor: headerBackgroundColor.light,
            transform: [{ translateY: headerTranslate }],
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {headerImage}
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerHeight + 16, paddingHorizontal: 16, paddingBottom: 32 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});