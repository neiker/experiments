import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import randomColor from "random-color";

import { Item, Box } from "./Item";

const items: Box[] = Array.from(new Array(50)).map((_, i) => ({
  id: i,
  color: randomColor().hexString(),
}));

export const List: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView>
        {items.map((item) => (
          <Item key={item.id} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};
