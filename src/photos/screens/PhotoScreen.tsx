import { RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions, View, Text } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";

import { PhotosStackProps } from "../types";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const { photos, photoId } = route.params;
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      const photo = photos.find((p) => p.id === photoId);

      if (photo) {
        scrollViewRef.current.scrollTo({
          x: photos.indexOf(photo) * windowWidth,
          y: 0,
          animated: false,
        });
      }
    }
  }, [photos, photoId, windowWidth]);

  const style = {
    width: windowWidth,
    height: windowWidth,
  };

  return (
    <ScrollView
      horizontal
      snapToInterval={windowWidth}
      decelerationRate="fast"
      ref={scrollViewRef}
    >
      {photos.map((photo) => (
        <View
          style={{ flexDirection: "column", width: windowWidth }}
          key={photo.id}
        >
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
        </View>
      ))}
    </ScrollView>
  );
}
