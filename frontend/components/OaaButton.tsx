import { GestureResponderEvent, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { OaaButtonStyles as styles } from "../styles/OaaButtonStyles";
import { Icon } from "@react-native-material/core";
import { appColors } from "../styles/StyleAttributes";

type ButtonVariant = "primary" | "disabled" | "ghost" | "caution" | "outline" | "warning";

interface OoaButtonProps {
  label?: string;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: string;
  expand?: boolean;
  elevation?: boolean;
}

export function OaaButton({ label, variant = "primary", onPress, icon, expand = true, elevation = false }: OoaButtonProps) {
  // Styles button based on chosen variant
  const getStyles = (component: string) => {
    let wrapperStyles: any = [styles.container];
    if (expand) wrapperStyles.push(styles.expand);
    if (elevation) wrapperStyles.push(styles.elevation);
    let textStyles: any = [styles.text];
    let iconColor = appColors.bodyInverted;
    switch (variant) {
      case "primary":
        wrapperStyles.push(styles.primary);
        break;
      case "caution":
        wrapperStyles.push(styles.caution);
        break;
      case "warning":
        wrapperStyles.push(styles.warning);
        break;
      case "ghost":
        wrapperStyles.push(styles.ghost);
        textStyles.push(styles.ghostText);
        iconColor = appColors.body;
        break;
      case "disabled":
        wrapperStyles.push(styles.disabled);
        textStyles.push(styles.disabledText);
        iconColor = appColors.bodyDisabled;
        break;
      case "outline":
        wrapperStyles.push(styles.outline);
        textStyles.push(styles.outlineText);
        iconColor = appColors.buttonPrimary;
        break;
    }
    if (component === "wrapper") {
      return wrapperStyles;
    } else if (component === "text") {
      return textStyles;
    } else if (component === "icon") {
      return iconColor;
    }
  };

  return (
    <View style={[{ flex: 1 }, elevation && styles.shadow]}>
      <TouchableOpacity
        activeOpacity={variant === "disabled" ? 1 : 0.8}
        style={getStyles("wrapper")}
        disabled={variant === "disabled"}
        onPress={onPress}>
        {icon && <Icon name={icon} size={24} color={getStyles("icon")} />}
        {label && <Text style={getStyles("text")}>{label}</Text>}
      </TouchableOpacity>
    </View>
  );
}
