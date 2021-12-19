import React from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import * as redash from "react-native-redash";
import Reanimated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { clamp } from "react-native-redash";

import { useScreenAvailableSize } from "../utils/useScreenAvailableSize";

const styles = StyleSheet.create({
  widgetPosition: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export const Draggable: React.FC<{
  position: redash.Vector<Reanimated.SharedValue<number>>;
  size: redash.Vector<Reanimated.SharedValue<number>>;

  onDragEnd: (position: { x: number; y: number }) => void;
}> = ({ children, position, size, onDragEnd }) => {
  const isActive = useSharedValue(false);

  const screenAvailableSize = useScreenAvailableSize();

  const panGestureHandler = useAnimatedGestureHandler<
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
        screenAvailableSize.width - size.x.value
      );

      position.y.value = clamp(
        event.translationY + ctx.offsetY,
        0,
        screenAvailableSize.height - size.y.value
      );
    },
    onEnd: () => {
      runOnJS(onDragEnd)({ x: position.x.value, y: position.y.value });
    },
    onFinish: () => {
      isActive.value = false;
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
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Reanimated.View style={[styles.widgetPosition, style]}>
        {children}
      </Reanimated.View>
    </PanGestureHandler>
  );
};
