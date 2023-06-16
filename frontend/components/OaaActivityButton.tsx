import { TouchableOpacity, Text, Image, GestureResponderEvent } from "react-native";
import { useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { OaaActivityButtonStyles } from "../styles/OaaActivityButtonStyles";
import { primary } from "../styles/StyleAttributes";

interface OoaActivityButtonProps {
  label: string;
  active: boolean;
  id: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export function OaaActivityButton({ label, id, active, onPress }: OoaActivityButtonProps) {
  const [imageSrc, setImageSrc] = useState<string>(backendUrl + "/images/activities/" + id + ".jpg");

  const onFallback = () => {
    setImageSrc(backendUrl + "/images/activities/placeholder_small.jpg");
  };

  return (
    <TouchableOpacity style={OaaActivityButtonStyles.container} activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
      <Image style={OaaActivityButtonStyles.image} resizeMode={"cover"} source={{ uri: imageSrc }} onError={() => onFallback()} />
      <Text numberOfLines={1} style={[OaaActivityButtonStyles.label, { color: active ? primary["700"] : primary["300"] }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
