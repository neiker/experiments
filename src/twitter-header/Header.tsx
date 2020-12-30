import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "./colors";

export const HEADER_HEIGHT = 60;

export function Header() {
  const { goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  return (
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
  );
}
