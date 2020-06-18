import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  usePanGestureHandler,
  withOffset,
  diffClamp,
  useValue,
} from "react-native-redash";
import Reanimated, { useCode } from "react-native-reanimated";

const { cond, eq, set } = Reanimated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  sticky: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

const windowSize = Dimensions.get("window");

const Widget: React.FC<Widget> = ({
  x,
  y,
  width,
  height,
  properties: { color },
}) => {
  const opacity = useValue(1);
  const offsetX = useValue(x);
  const offsetY = useValue(y);

  const { gestureHandler, state, translation } = usePanGestureHandler();

  const translateX = diffClamp(
    withOffset(translation.x, state, offsetX),
    0,
    windowSize.width - width
  );

  const translateY = diffClamp(
    withOffset(translation.y, state, offsetY),
    0,
    windowSize.height - height
  );

  useCode(
    () => [
      cond(eq(state, State.ACTIVE), set(opacity, 0.6)),
      cond(eq(state, State.END), set(opacity, 1)),
    ],
    []
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Reanimated.View
        style={[
          styles.sticky,
          {
            width,
            height,
            backgroundColor: color,
            opacity,
            transform: [{ translateX }, { translateY }],
          },
        ]}
      />
    </PanGestureHandler>
  );
};

interface Widget {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    color: string;
  };
}
const widgets: Widget[] = [
  {
    id: "1",
    x: 45,
    y: 121,
    width: 120,
    height: 120,
    properties: {
      color: "yellow",
    },
  },
  {
    id: "2",
    x: 452,
    y: 11,
    width: 120,
    height: 120,
    properties: {
      color: "green",
    },
  },
  {
    id: "3",
    x: 34,
    y: 431,
    width: 120,
    height: 120,
    properties: {
      color: "blue",
    },
  },
  {
    id: "4",
    x: 105,
    y: 401,
    width: 180,
    height: 120,
    properties: {
      color: "red",
    },
  },
];

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      {widgets.map((widget) => (
        <Widget key={widget.id} {...widget} />
      ))}
    </View>
  );
};

export default App;
