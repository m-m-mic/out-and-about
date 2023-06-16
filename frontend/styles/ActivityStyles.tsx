import { StyleSheet } from "react-native";
import { appColors } from "./StyleAttributes";

export const ActivityStyles = StyleSheet.create({
  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 16,
    zIndex: 1,
  },
  absoluteButton: {
    zIndex: 5,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  mainView: {
    backgroundColor: appColors.background,
    marginTop: 120,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
});
