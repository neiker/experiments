import { RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions, View, Text } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";

import { PhotosStackProps } from "../types";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const { photo } = route.params;
  const windowDimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const style = {
    width: windowDimensions.width,
    height: windowDimensions.width,
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <SharedElement id={`item.${photo.id}.photo`} style={style}>
          <Image uri={photo.url} style={style} />
        </SharedElement>
      </View>

      <View
        style={{
          paddingBottom: insets.bottom,
          backgroundColor: "#111",
        }}
      >
        <Text style={{ color: "#ddd", fontSize: 12, margin: 20 }}>
          {photo.title}
        </Text>
      </View>
    </>
  );
}
