import { RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { SharedElement } from "react-navigation-shared-element";

import { PhotosStackProps } from "../types";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const windowDimensions = useWindowDimensions();

  const style = {
    width: windowDimensions.width,
    height: windowDimensions.width,
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <SharedElement id={`item.${route.params.photo.id}.photo`} style={style}>
        <Image uri={route.params.photo.url} style={style} />
      </SharedElement>
    </View>
  );
}
