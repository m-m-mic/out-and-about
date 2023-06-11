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
}

export function OaaIconButton({ name, size = 24, variant = "ghost", onPress }: OaaIconButtonProps) {
  const [color, setColor] = useState(variant === "transparent" ? appColors.bodyInverted : appColors.body);

  const getStyles = () => {
    let ButtonStyles: any = [styles.wrapper];
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
    <TouchableOpacity activeOpacity={0.8} style={[getStyles(), { width: size + 8, height: size + 8 }]} onPress={onPress}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}
