import { NavigationProp, RouteProp } from "@react-navigation/native";
import React from "react";
import { useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { PhotosStackProps } from "../../types";

import { PhotoItem } from "./PhotoItem";

interface PhotoScreenProps {
  route: RouteProp<PhotosStackProps, "Photo">;
  navigation: NavigationProp<PhotosStackProps, "Photo">;
}

export function PhotoScreen({ route, navigation }: PhotoScreenProps) {
  const { photos, photoId } = route.params;
  const { width: windowWidth } = useWindowDimensions();

  const initialScrollIndex = React.useMemo(() => {
    const photo = photos.find(({ id }) => id === photoId);

    if (photo) {
      return photos.indexOf(photo);
    }
  }, [photoId, photos]);

  return (
    <FlatList
      horizontal
      snapToInterval={windowWidth}
      decelerationRate="fast"
      data={photos}
      initialScrollIndex={initialScrollIndex}
      keyExtractor={(photo) => `${photo.id}`}
      renderItem={({ item: photo }) => (
        <PhotoItem photo={photo} width={windowWidth} />
      )}
      getItemLayout={(_, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
      })}
      onMomentumScrollEnd={({ nativeEvent }) => {
        const currentIndex = Math.round(
          nativeEvent.contentOffset.x / windowWidth
        );
        const photo = photos[currentIndex];

        if (photo) {
          navigation.setParams({ photoId: photo.id });
        }
      }}
    />
  );
}
