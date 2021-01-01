import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/stack";

export function useScreenAvailableSize() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  return {
    height: windowDimensions.height - headerHeight - insets.bottom,
    width: windowDimensions.width - insets.left - insets.right,
  };
}
