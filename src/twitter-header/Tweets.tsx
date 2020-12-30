import React from "react";
import { FlatList } from "react-native";
import { Divider } from "react-native-elements";
import faker from "faker";

import { Tweet, TweetData } from "./Tweet";
import { colors } from "./colors";

const TWEETS: TweetData[] = [...Array(40)].map((_, id) => ({
  id,
  author: {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    avatarUrl: faker.image.imageUrl(50, 50, "people", true, true),
  },
  content: faker.lorem.sentence(faker.random.number(30)),
  comments: faker.random.number(10),
  retweets: faker.random.number(50),
  likes: faker.random.number(300),
}));

export function Tweets() {
  return (
    <FlatList
      ItemSeparatorComponent={() => (
        <Divider style={{ backgroundColor: colors.exlightGray }} />
      )}
      keyExtractor={(_, index) => index.toString()}
      data={TWEETS}
      renderItem={({ item }) => <Tweet item={item} />}
      bounces={false}
    />
  );
}
