import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native-expo-image-cache";

import { AlbumWithPhotos } from "../../types";

const WHITE = "#fafafa";
const BLACK = "#040404";

interface AlbumThumbnailProps {
  size: number;
  album: AlbumWithPhotos;
  onPress: () => void;
}

export function AlbumThumbnail({ size, album, onPress }: AlbumThumbnailProps) {
  const smallThumbSize = size / 4;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ width: size }}>
        <Image
          uri={album.photos[0].thumbnailUrl}
          style={{
            width: size,
            height: size - smallThumbSize,
          }}
        />

        <View style={{ flexDirection: "row" }}>
          {album.photos.slice(1, 4).map((photo) => (
            <Image
              key={photo.id}
              uri={photo.thumbnailUrl}
              style={{
                width: smallThumbSize,
                height: smallThumbSize,
              }}
            />
          ))}

          <View
            style={{
              width: smallThumbSize,
              height: smallThumbSize,
              backgroundColor: BLACK,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: WHITE,
                fontWeight: "500",
                fontSize: 15,
              }}
            >
              {`+${album.photos.length - 4}`}
            </Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            padding: 10,
            backgroundColor: BLACK + "77", // Black with opacity
          }}
        >
          <Text
            style={{
              color: WHITE,
              fontWeight: "500",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {album.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
