import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "./colors";

export function Header() {
  const { goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 15,
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomColor: colors.exlightGray,
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
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
