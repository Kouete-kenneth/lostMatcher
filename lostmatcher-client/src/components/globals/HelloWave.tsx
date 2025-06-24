import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function HelloWave() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 200 }),
        withTiming(20, { duration: 200 }),
        withTiming(-20, { duration: 200 }),
        withTiming(0, { duration: 200 })
      ),
      2,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={{ fontSize: 32 }}>👋</Text>
    </Animated.View>
  );
}