import { RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { Image } from "react-native-expo-image-cache";

import { PhotosStackProps } from "../types";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const windowDimensions = useWindowDimensions();

  return (
    <Image
      uri={route.params.photo.url}
      style={{
        width: windowDimensions.width,
        height: windowDimensions.width,
      }}
    />
  );
}
