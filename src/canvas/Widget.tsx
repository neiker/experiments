import React from "react";
import { Text } from "react-native";
import Reanimated from "react-native-reanimated";
import { useVector } from "react-native-redash";

import { Draggable } from "./Draggable";
import { Selecteable } from "./Selecteable";

export interface Widget {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    color: string;
    text: string;
  };
}

export const WidgetComponent: React.FC<{
  widget: Widget;
  onUpdate: (widget: Widget) => void;
}> = ({ widget, onUpdate }) => {
  const position = useVector(widget.x, widget.y);
  const size = useVector(widget.width, widget.height);

  const onDragEnd = ({ x, y }: { x: number; y: number }) => {
    onUpdate({
      ...widget,
      x,
      y,
    });
  };

  const onResizeEnd = ({ width, height }: { width: number; height: number }) =>
    onUpdate({
      ...widget,
      width,
      height,
    });

  return (
    <Draggable position={position} size={size} onDragEnd={onDragEnd}>
      <Selecteable size={size} onResizeEnd={onResizeEnd}>
        <Reanimated.View
          style={{
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
            width: size.x,
            height: size.y,
            backgroundColor: widget.properties.color,
          }}
        >
          <Text style={{ textAlign: "center" }}>{widget.properties.text}</Text>
        </Reanimated.View>
      </Selecteable>
    </Draggable>
  );
};
