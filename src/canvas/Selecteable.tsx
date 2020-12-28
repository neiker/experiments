import React from "react";
import { View } from "react-native";
import {
  State,
  TapGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Reanimated, {
  runOnJS,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { Vector, clamp } from "react-native-redash";

const ResizeHandler: React.FC<{
  size: Vector<Reanimated.SharedValue<number>>;
  onResizeEnd: (size: { width: number; height: number }) => void;
}> = ({ size, onResizeEnd }) => {
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { originalWidth: number; originalHeight: number }
  >({
    onStart: (_, ctx) => {
      ctx.originalWidth = size.x.value;
      ctx.originalHeight = size.y.value;
    },
    onActive: (event, ctx) => {
      size.x.value = clamp(ctx.originalWidth + event.translationX, 100, 200);
      size.y.value = clamp(ctx.originalHeight + event.translationY, 100, 200);
    },
    onEnd: () => {
      runOnJS(onResizeEnd)({ width: size.x.value, height: size.y.value });
    },
  });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderWidth: 2,
        borderColor: "#99f",
      }}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Reanimated.View
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={{
            width: 10,
            height: 10,
            backgroundColor: "#99f",
            position: "absolute",
            bottom: -5,
            right: -5,
            borderRadius: 5,
          }}
        />
      </PanGestureHandler>
    </View>
  );
};

export const Selecteable: React.FC<{
  size: Vector<Reanimated.SharedValue<number>>;
  selected: Reanimated.SharedValue<boolean>;
  onResizeEnd: (size: { width: number; height: number }) => void;
  onPress: () => void;
}> = ({ children, size, selected, onResizeEnd, onPress }) => {
  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onPress();
        }
      }}
    >
      <View>
        {selected.value && <ResizeHandler {...{ size, onResizeEnd }} />}
        {children}
      </View>
    </TapGestureHandler>
  );
};
