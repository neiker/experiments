import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { colors } from "./colors";

export const HEADER_HEIGHT = 60;

interface HeaderProps {
  translateY: Reanimated.SharedValue<number>;
}

export function Header({ translateY }: HeaderProps) {
  const { goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
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
          zIndex: 2,
        },
      ]}
    >
      <View
        style={{
          height: HEADER_HEIGHT + insets.top,
          paddingTop: insets.top,
          paddingHorizontal: 20,
          borderBottomColor: colors.exlightGray,
          borderBottomWidth: StyleSheet.hairlineWidth,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={goBack}>
          <Icon name="menu" type="simple-line-icon" color={colors.primary} />
        </TouchableOpacity>

        <Icon name="twitter" type="antdesign" color={colors.primary} />
        <Icon name="note" type="simple-line-icon" color={colors.primary} />
      </View>
    </Reanimated.View>
  );
}
