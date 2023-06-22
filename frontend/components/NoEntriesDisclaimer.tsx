import { Text, View } from "react-native";
import { Icon } from "@react-native-material/core";
import { appColors, typefaces } from "../styles/StyleAttributes";

interface NoEntriesDisclaimerProps {
  text?: string;
  icon?: string;
}

export function NoEntriesDisclaimer({
  text = "Du hast in dieser Kategorie keine Optionen.",
  icon = "help-rhombus",
}: NoEntriesDisclaimerProps) {
  return (
    <View
      style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center", marginVertical: 20, marginHorizontal: 10 }}>
      <Icon name={icon} size={48} color={appColors.body} />
      <Text style={{ color: appColors.body, fontFamily: typefaces.button.fontFamily, flex: 1, textAlign: "center" }}>{text}</Text>
    </View>
  );
}
