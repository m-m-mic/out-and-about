import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { Icon } from "@react-native-material/core";
import { useState } from "react";
import { appColors } from "../styles/StyleAttributes";
import { ooaIconButtonStyles as styles } from "../styles/ooaIconButtonStyles";

type IconButtonVariant = "ghost" | "transparent";

interface OaaIconButtonProps {
  name: string;
  size?: number;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: IconButtonVariant;
  disabled?: boolean;
}

export function OaaIconButton({ name, size = 24, variant = "ghost", onPress, disabled = false }: OaaIconButtonProps) {
  const [color, setColor] = useState(
    disabled ? appColors.bodyDisabled : variant === "transparent" ? appColors.bodyInverted : appColors.body
  );
  const getStyles = () => {
    let ButtonStyles: any = [styles.container];
    switch (variant) {
      case "ghost":
        ButtonStyles.push(styles.ghost);
        return ButtonStyles;
      case "transparent":
        ButtonStyles.push(styles.transparent);
        return ButtonStyles;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
      style={[getStyles(), { width: size + 8, height: size + 8 }]}
      onPress={onPress}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}
