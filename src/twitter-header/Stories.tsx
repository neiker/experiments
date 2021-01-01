import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import faker from "faker";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { colors } from "./colors";

function Story({
  avatar,
  title,
  me,
}: {
  avatar: string;
  title: string;
  me?: boolean;
}) {
  return (
    <View style={{ marginRight: 15 }}>
      <Avatar
        containerStyle={{
          backgroundColor: colors.white,
          padding: 2,
          borderColor: me ? "transparent" : colors.primary,
          borderWidth: 2,
        }}
        size={55}
        rounded
        source={{ uri: avatar }}
        children={
          me && (
            <Avatar.Accessory
              name="plus"
              type="material-community"
              color="white"
              backgroundColor={colors.primary}
              size={14}
              borderRadius={7}
            />
          )
        }
      />

      <Text
        style={{
          marginTop: 5,
          fontSize: 12,
          width: 50,
          textAlign: "center",
          color: colors.darkGray,
          fontWeight: "300",
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

export const STORIES_HEIGHT = 120;

const STORIES = [...Array(20)].map((_, id) => ({
  id,
  username: faker.internet.userName(),
  avatar: faker.image.imageUrl(50, 50, "people", true, true),
}));

interface StoriesProps {
  translateY: Reanimated.SharedValue<number>;
  offsetY: number;
}

export function Stories({ translateY, offsetY }: StoriesProps) {
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value + offsetY }],
    };
  });

  return (
    <Reanimated.View
      style={[
        headerAnimatedStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{
          height: STORIES_HEIGHT,
          backgroundColor: colors.white,
          borderBottomColor: colors.exlightGray,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Story
          me
          avatar={faker.image.imageUrl(50, 50, "people", true, true)}
          title="Add"
        />

        {STORIES.map((item) => {
          return (
            <Story key={item.id} avatar={item.avatar} title={item.username} />
          );
        })}
      </ScrollView>
    </Reanimated.View>
  );
}
