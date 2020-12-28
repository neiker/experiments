import React from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { Vector } from "react-native-redash";
import Reanimated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Dimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const windowSize = Dimensions.get("window");

const styles = StyleSheet.create({
  widgetPosition: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

export const Draggable: React.FC<{
  position: Vector<Reanimated.SharedValue<number>>;
  size: Vector<Reanimated.SharedValue<number>>;

  onDragEnd: (position: { x: number; y: number }) => void;
}> = ({ children, position, size, onDragEnd }) => {
  const insets = useSafeAreaInsets();
  const isActive = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onStart: (_, ctx) => {
      isActive.value = true;

      ctx.offsetX = position.x.value;
      ctx.offsetY = position.y.value;
    },
    onActive: (event, ctx) => {
      position.x.value = clamp(
        event.translationX + ctx.offsetX,
        0,
        windowSize.width - size.x.value
      );

      position.y.value = clamp(
        event.translationY + ctx.offsetY,
        0,
        windowSize.height - (62 + insets.bottom) - size.y.value
      );
    },
    onEnd: () => {
      isActive.value = false;

      runOnJS(onDragEnd)({ x: position.x.value, y: position.y.value });
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: withSpring(isActive.value ? 2 : 0),
        height: withSpring(isActive.value ? 2 : 0),
      },
      shadowOpacity: withSpring(isActive.value ? 0.25 : 0),
      shadowRadius: withSpring(isActive.value ? 3 : 0),

      elevation: withSpring(isActive.value ? 5 : 0),

      transform: [
        { translateX: position.x.value },
        { translateY: position.y.value },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Reanimated.View style={[styles.widgetPosition, style]}>
        {children}
      </Reanimated.View>
    </PanGestureHandler>
  );
};
