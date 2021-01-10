import { RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Photo, PhotosStackProps } from "../../types";

import { PhotoItem } from "./PhotoItem";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route }: PhotoScreenProps) {
  const { photos, photoId } = route.params;
  const { width: windowWidth } = useWindowDimensions();

  const scrollViewRef = React.useRef<FlatList<Photo>>(null);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      const photo = photos.find((p) => p.id === photoId);

      if (photo) {
        scrollViewRef.current.scrollToItem({
          item: photo,
          animated: false,
        });
      }
    }
  }, [photos, photoId, windowWidth]);

  return (
    <FlatList
      horizontal
      snapToInterval={windowWidth}
      decelerationRate="fast"
      ref={scrollViewRef}
      data={photos}
      keyExtractor={(photo) => `${photo.id}`}
      renderItem={({ item: photo }) => (
        <PhotoItem photo={photo} width={windowWidth} />
      )}
      getItemLayout={(_, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
      })}
    />
  );
}
