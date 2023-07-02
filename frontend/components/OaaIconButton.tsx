import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { appColors } from "../styles/StyleAttributes";
import { OaaIconButtonStyles as styles } from "../styles/OaaIconButtonStyles";

type IconButtonVariant = "ghost" | "transparent" | "primary";

interface OaaIconButtonProps {
  name: string;
  size?: number;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: IconButtonVariant;
  disabled?: boolean;
  rounded?: boolean;
}

export function OaaIconButton({
  name,
  size = 24,
  variant = "ghost",
  onPress,
  disabled = false,
  rounded = true,
}: OaaIconButtonProps) {
  const [color, setColor] = useState(
    disabled ? appColors.bodyDisabled : variant === "transparent" ? appColors.bodyInverted : appColors.body
  );

  useEffect(() => {
    setColor(
      disabled
        ? appColors.bodyDisabled
        : variant === "transparent" || variant === "primary"
        ? appColors.bodyInverted
        : appColors.body
    );
  }, [disabled, variant]);

  // Styles icon button based on chosen variant
  const getStyles = () => {
    let ButtonStyles: any = [styles.container];
    if (!rounded) ButtonStyles.push(styles.rectangle);
    switch (variant) {
      case "ghost":
        ButtonStyles.push(styles.ghost);
        return ButtonStyles;
      case "transparent":
        ButtonStyles.push(styles.transparent);
        return ButtonStyles;
      case "primary":
        ButtonStyles.push(styles.primary);
        return ButtonStyles;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
      style={[getStyles(), rounded ? { width: size + 8, height: size + 8 } : { width: size + 26, height: size + 26 }]}
      onPress={onPress}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}
