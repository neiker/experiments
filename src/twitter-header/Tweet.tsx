import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "./colors";

export interface TweetData {
  id: number;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;

  comments: number;
  retweets: number;
  likes: number;
}

function FooterIcon({ iconName, count }: { iconName: string; count?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
      <Icon name={iconName} type="material-community" size={16} />
      {count !== undefined && (
        <Text style={{ marginLeft: 5, color: "#333", fontSize: 12 }}>
          {count}
        </Text>
      )}
    </View>
  );
}

function LikeButton({ count }: { count: number }) {
  const [checked, isChecked] = React.useState(false);

  const state = useSharedValue(0);

  React.useEffect(() => {
    if (checked) {
      state.value = withTiming(1, {
        duration: 1000,
      });
    } else {
      state.value = 0;
    }
  });

  const activeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        state.value,
        [0, 0.1, 1],
        [0, 0, 1],
        Reanimated.Extrapolate.CLAMP
      ),
    };
  });

  const inactiveStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        state.value,
        [0, 0.1, 1],
        [1, 1, 0],
        Reanimated.Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            state.value,
            [0, 0.1],
            [1, 0],
            Reanimated.Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => {
          isChecked((v) => !v);
        }}
      >
        <View style={{ width: 16, height: 16 }}>
          <Reanimated.View style={[StyleSheet.absoluteFillObject, activeStyle]}>
            <Icon
              name="heart"
              type="material-community"
              size={16}
              color="red"
            />
          </Reanimated.View>
          <Reanimated.View
            style={[StyleSheet.absoluteFillObject, inactiveStyle]}
          >
            <Icon
              name="heart-outline"
              type="material-community"
              size={16}
              color="red"
            />
          </Reanimated.View>
        </View>
        {count !== undefined && (
          <Text style={{ marginLeft: 5, color: "#333", fontSize: 12 }}>
            {count}
          </Text>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
}

// TODO Maybe improve the look of this component?
// I would really like to go to the detail here but is not the point of the experiment.
export function Tweet({ item }: { item: TweetData }) {
  return (
    <ListItem
      containerStyle={{
        alignItems: "flex-start",
        backgroundColor: colors.white,
      }}
    >
      <Avatar
        size={50}
        rounded
        source={{
          uri: item.author.avatarUrl,
        }}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{ fontWeight: "500", fontSize: 14, marginBottom: 2 }}
        >
          {item.author.name}
          <Text
            style={{
              fontWeight: "300",
              color: colors.darkGray,
            }}
          >{` @${item.author.username}`}</Text>
        </ListItem.Title>
        <ListItem.Subtitle
          style={{
            fontSize: 14,
            fontWeight: "400",
          }}
        >
          {item.content}
        </ListItem.Subtitle>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
          }}
        >
          <FooterIcon iconName="comment-outline" count={item.comments} />
          <FooterIcon iconName="twitter-retweet" count={item.retweets} />

          <LikeButton count={item.likes} />
          <FooterIcon iconName="share-outline" />
        </View>
      </ListItem.Content>
    </ListItem>
  );
}
