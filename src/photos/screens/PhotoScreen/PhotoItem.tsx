import React from "react";
import { View, Text } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { colorWithOpacity, palette } from "../../palette";
import { Photo } from "../../types";

export function PhotoItem({ width, photo }: { width: number; photo: Photo }) {
  const insets = useSafeAreaInsets();

  // TODO measure the view and replace the initial value with the view height
  const translateY = useSharedValue(80);

  React.useEffect(() => {
    translateY.value = withDelay(150, withTiming(0));
  }, [translateY]);

  const bottomWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <View style={{ flexDirection: "column", width }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <SharedElement id={`item.${photo.id}.photo`}>
          <Image
            uri={photo.url}
            style={{
              width,
              height: width,
            }}
          />
        </SharedElement>
      </View>

      <Reanimated.View
        style={[
          bottomWrapperAnimatedStyle,
          {
            paddingBottom: insets.bottom,
            backgroundColor: colorWithOpacity(palette.white, 0.1),
          },
        ]}
      >
        <Text style={{ color: palette.white, fontSize: 12, margin: 20 }}>
          {photo.title}
        </Text>
      </Reanimated.View>
    </View>
  );
}
