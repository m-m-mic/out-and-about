import { GestureResponderEvent, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { OaaChipStyles as styles } from "../styles/OaaChipStyles";

type ChipVariant = "primary" | "disabled" | "unselected" | "caution" | "outline";

type ChipSize = "medium" | "small";

interface OoaChipProps {
  label?: string;
  variant?: ChipVariant;
  onPress?: (event: GestureResponderEvent) => void;
  size?: ChipSize;
}

export function OaaChip({ label, variant = "primary", size = "medium", onPress }: OoaChipProps) {
  // Styles chip based on chosen variant
  const getStyles = (component: string) => {
    let containerStyles: any = [styles.container];
    let textStyles: any = [styles.text];
    if (size === "small") {
      containerStyles.push(styles.cSmall);
      textStyles.push(styles.tSmall);
    }
    switch (variant) {
      case "primary":
        containerStyles.push(styles.primary);
        break;
      case "caution":
        containerStyles.push(styles.caution);
        break;
      case "unselected":
        containerStyles.push(styles.unselected);
        break;
      case "disabled":
        containerStyles.push(styles.disabled);
        textStyles.push(styles.disabledText);
        break;
      case "outline":
        containerStyles.push(styles.outline);
        textStyles.push(styles.outlineText);
        break;
    }
    if (component === "wrapper") {
      return containerStyles;
    } else {
      return textStyles;
    }
  };
  if (!onPress) {
    return <View style={getStyles("wrapper")}>{label && <Text style={getStyles("text")}>{label}</Text>}</View>;
  } else {
    return (
      <TouchableOpacity
        activeOpacity={variant === "disabled" ? 1 : 0.8}
        style={getStyles("wrapper")}
        disabled={variant === "disabled"}
        onPress={onPress}>
        {label && <Text style={getStyles("text")}>{label}</Text>}
      </TouchableOpacity>
    );
  }
}
