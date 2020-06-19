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
import { usePanGestureHandler, diffClamp } from "react-native-redash";

const ResizeHandler: React.FC<{
  width: Value<number>;
  height: Value<number>;
  onResize: (size: { width: number; height: number }) => void;
}> = ({ width, height, onResize }) => {
  const { gestureHandler, state, translation } = usePanGestureHandler();
  const originalWidth = new Value(0);
  const originalHeight = new Value(0);

  const onEnd = React.useCallback(
    (size) => {
      onResize({ width: size[0], height: size[1] });
    },
    [onResize]
  );

  useCode(
    () => [
      cond(or(eq(state, State.BEGAN), eq(state, State.UNDETERMINED)), [
        set(originalWidth, width),
        set(originalHeight, height),
      ]),
      cond(eq(state, State.ACTIVE), [
        set(width, diffClamp(add(originalWidth, translation.x), 100, 200)),
        set(height, diffClamp(add(originalHeight, translation.y), 100, 200)),
      ]),
      cond(or(eq(state, State.FAILED), eq(state, State.CANCELLED)), [
        set(width, originalWidth),
        set(height, originalHeight),
      ]),
      cond(eq(state, State.END), call([width, height], onEnd)),
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
  width: Value<number>;
  height: Value<number>;
  onResize: (size: { width: number; height: number }) => void;
}> = ({ children, width, height, onResize }) => {
  const [selected, setSelected] = React.useState(false);

  const toggle = React.useCallback(() => setSelected((c) => !c), []);

  console.log(selected);
  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          toggle();
        }
      }}
    >
      <View>
        {selected && <ResizeHandler {...{ width, height, onResize }} />}
        {children}
      </View>
    </TapGestureHandler>
  );
};
