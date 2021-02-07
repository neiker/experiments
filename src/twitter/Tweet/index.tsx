import React from "react";
import { Animated, Easing, Text, View } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

import { colors } from "../colors";

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
  const [checked, isChecked] = React.useState<boolean | undefined>(undefined);
  const progress = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (checked !== undefined) {
      const timing = Animated.timing(progress.current, {
        toValue: checked ? 0.5 : 1,
        duration: checked ? 2000 : 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      });

      timing.start(({ finished }) => {
        if (finished && !checked) {
          progress.current.setValue(0);
        }
      });

      return timing.stop;
    }
  }, [checked]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={() => {
          isChecked((v) => !v);
        }}
        hitSlop={{
          top: 8,
          left: 8,
          right: 8,
          bottom: 8,
        }}
      >
        <View style={{ width: 16, height: 16 }}>
          <LottieView
            progress={progress.current}
            style={{
              marginTop: -5,
              marginLeft: -6,
              width: 42,
              height: 42,
            }}
            source={require("./like-lottie.json")}
          />
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
