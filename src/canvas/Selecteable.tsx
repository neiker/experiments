import React from "react";
import { View } from "react-native";
import {
  State,
  TapGestureHandler,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Reanimated, {
  Value,
  useCode,
  cond,
  set,
  call,
  eq,
  add,
  or,
} from "react-native-reanimated";
import { usePanGestureHandler, diffClamp, Vector } from "react-native-redash";

const ResizeHandler: React.FC<{
  size: Vector<Reanimated.Value<number>>;
  onResizeEnd: (size: { width: number; height: number }) => void;
}> = ({ size, onResizeEnd }) => {
  const { gestureHandler, state, translation } = usePanGestureHandler();
  const originalWidth = new Value(0);
  const originalHeight = new Value(0);

  const onEnd = React.useCallback(
    ([width, height]) => {
      onResizeEnd({ width, height });
    },
    [onResizeEnd]
  );

  useCode(
    () => [
      cond(or(eq(state, State.BEGAN), eq(state, State.UNDETERMINED)), [
        set(originalWidth, size.x),
        set(originalHeight, size.y),
      ]),
      cond(eq(state, State.ACTIVE), [
        set(size.x, diffClamp(add(originalWidth, translation.x), 100, 200)),
        set(size.y, diffClamp(add(originalHeight, translation.y), 100, 200)),
      ]),
      cond(or(eq(state, State.FAILED), eq(state, State.CANCELLED)), [
        set(size.x, originalWidth),
        set(size.y, originalHeight),
      ]),
      cond(eq(state, State.END), call([size.x, size.y], onEnd)),
    ],
    []
  );
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
      <PanGestureHandler {...gestureHandler}>
        <Reanimated.View
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
  size: Vector<Reanimated.Value<number>>;
  selected: boolean;
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
        {selected && <ResizeHandler {...{ size, onResizeEnd }} />}
        {children}
      </View>
    </TapGestureHandler>
  );
};
