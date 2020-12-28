import React from "react";
import { StyleSheet, View } from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Widget, WidgetComponent } from "./Widget";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});

const defaultWidget: Widget[] = [
  {
    id: "1",
    x: 50,
    y: 50,
    width: 120,
    height: 120,
    properties: {
      color: "#fffb09",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  },
  {
    id: "2",
    x: 85,
    y: 11,
    width: 120,
    height: 120,
    properties: {
      color: "#64e72f",
      text:
        "Suspendisse eu scelerisque magna, vitae vestibulum ex. Phasellus ut aliquet sapien. ",
    },
  },
  {
    id: "3",
    x: 34,
    y: 431,
    width: 120,
    height: 120,
    properties: {
      color: "#3459ff",
      text: "Cras aliquam est eget ex pulvinar, vitae egestas lacus sagittis. ",
    },
  },
  {
    id: "4",
    x: 105,
    y: 401,
    width: 180,
    height: 120,
    properties: {
      color: "#ff6c28",
      text:
        "Cras facilisis justo ligula, at vulputate lorem ornare nec. Duis ac enim leo.",
    },
  },
];

export const Canvas: React.FC = () => {
  const [widgets, setWidgets] = React.useState<Widget[]>();

  React.useEffect(() => {
    AsyncStorage.getItem("widgets").then((res) => {
      // typesafety? where we go we don't need typesafety
      const ws = res ? (JSON.parse(res) as Widget[]) : defaultWidget;

      setWidgets(ws.map((w) => ({ ...w, selected: false })));
    });
  }, []);

  React.useEffect(() => {
    if (widgets) {
      AsyncStorage.setItem("widgets", JSON.stringify(widgets));
    }
  }, [widgets]);

  const resetSelection = () => {
    setWidgets((ws) =>
      ws?.map((w) => (w.selected ? { ...w, selected: false } : w))
    );
  };

  if (!widgets) {
    return null;
  }

  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          resetSelection();
        }
      }}
    >
      <View style={styles.container}>
        {widgets.map((widget) => (
          <WidgetComponent
            key={widget.id}
            widget={widget}
            onUpdate={(newWidget) => {
              setWidgets((current) =>
                current?.map((w) => {
                  return w.id === newWidget.id ? newWidget : w;
                })
              );
            }}
          />
        ))}
      </View>
    </TapGestureHandler>
  );
};
