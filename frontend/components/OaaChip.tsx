import { GestureResponderEvent, TouchableOpacity, Text } from "react-native";
import React from "react";
import { ooaChipStyles as styles } from "../styles/ooaChipStyles";

type ChipVariant = "primary" | "disabled" | "unselected" | "caution" | "outline";

interface OoaChipProps {
  label?: string;
  variant?: ChipVariant;
  onPress?: (event: GestureResponderEvent) => void;
}

export function OaaChip({ label, variant = "primary", onPress }: OoaChipProps) {
  const getStyles = (component: string) => {
    let wrapperStyles: any = [styles.container];
    let textStyles: any = [styles.text];
    switch (variant) {
      case "primary":
        wrapperStyles.push(styles.primary);
        break;
      case "caution":
        wrapperStyles.push(styles.caution);
        break;
      case "unselected":
        wrapperStyles.push(styles.unselected);
        break;
      case "disabled":
        wrapperStyles.push(styles.disabled);
        textStyles.push(styles.disabledText);
        break;
      case "outline":
        wrapperStyles.push(styles.outline);
        textStyles.push(styles.outlineText);
        break;
    }
    if (component === "wrapper") {
      return wrapperStyles;
    } else {
      return textStyles;
    }
  };

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
