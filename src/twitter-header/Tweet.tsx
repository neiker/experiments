import React from "react";
import { Text, View } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";

import { colors } from "./colors";

export interface TweetData {
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
          <FooterIcon iconName="heart-outline" count={item.likes} />
          <FooterIcon iconName="share-outline" />
        </View>
      </ListItem.Content>
    </ListItem>
  );
}
