import { GestureResponderEvent, TouchableOpacity, Text } from "react-native";
import React from "react";
import { ooaButtonStyles as styles } from "../styles/ooaButtonStyles";

type ButtonVariant = "primary" | "disabled" | "ghost" | "caution" | "outline";

interface OoaButtonProps {
  label?: string;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
}

export function OaaButton({ label, variant = "primary", onPress }: OoaButtonProps) {
  const getStyles = (component: string) => {
    let wrapperStyles: any = [styles.wrapper];
    let textStyles: any = [styles.text];
    switch (variant) {
      case "primary":
        wrapperStyles.push(styles.primary);
        break;
      case "caution":
        wrapperStyles.push(styles.caution);
        break;
      case "ghost":
        wrapperStyles.push(styles.ghost);
        textStyles.push(styles.ghostText);
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
