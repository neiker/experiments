import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Image, useWindowDimensions } from "react-native";

import { PhotosStackProps } from "../types";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const windowDimensions = useWindowDimensions();

  return (
    <Image
      source={{ uri: route.params.photo.url }}
      style={{
        width: windowDimensions.width,
        height: windowDimensions.width,
      }}
    />
  );
}
