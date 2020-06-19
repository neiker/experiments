import React from "react";
import { Text } from "react-native";
import Reanimated, { Value } from "react-native-reanimated";

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
  const width = new Value(widget.width);
  const height = new Value(widget.height);
  const x = new Value(widget.x);
  const y = new Value(widget.y);

  const onDragEnd = (position: { x: number; y: number }) => {
    onUpdate({
      ...widget,
      ...position,
    });
  };

  const onResizeEnd = (size: { width: number; height: number }) =>
    onUpdate({
      ...widget,
      ...size,
    });

  return (
    <Draggable x={x} y={y} width={width} height={height} onDragEnd={onDragEnd}>
      <Selecteable width={width} height={height} onResize={onResizeEnd}>
        <Reanimated.View
          style={{
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
            width,
            height,
            backgroundColor: widget.properties.color,
          }}
        >
          <Text style={{ textAlign: "center" }}>{widget.properties.text}</Text>
        </Reanimated.View>
      </Selecteable>
    </Draggable>
  );
};
