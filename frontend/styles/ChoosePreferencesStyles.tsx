import { StyleSheet } from "react-native";

export const ChoosePreferencesStyles = StyleSheet.create({
  categoryContainer: {
    padding: 5,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  unselectedCategory: {
    backgroundColor: "grey",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  selectedCategory: {
    backgroundColor: "blue",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
});
