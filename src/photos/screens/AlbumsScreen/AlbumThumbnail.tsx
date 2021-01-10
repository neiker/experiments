import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native-expo-image-cache";
import { SharedElement } from "react-navigation-shared-element";

import { AlbumWithPhotos } from "../../types";
import { colorWithOpacity, palette } from "../../palette";

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
        <SharedElement id={`item.${album.photos[0].id}.photo`}>
          <Image
            uri={album.photos[0].thumbnailUrl}
            style={{
              width: size,
              height: size - smallThumbSize,
            }}
          />
        </SharedElement>

        <View style={{ flexDirection: "row" }}>
          {album.photos.slice(1, 4).map((photo) => (
            <SharedElement key={photo.id} id={`item.${photo.id}.photo`}>
              <Image
                uri={photo.thumbnailUrl}
                style={{
                  width: smallThumbSize,
                  height: smallThumbSize,
                }}
              />
            </SharedElement>
          ))}

          <View
            style={{
              width: smallThumbSize,
              height: smallThumbSize,
              backgroundColor: palette.black,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: palette.white,
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
            backgroundColor: colorWithOpacity(palette.black, 0.5),
          }}
        >
          <Text
            style={{
              color: palette.white,
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
