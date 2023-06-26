import { Image, View, Text } from "react-native";
import React, { useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { OaaActivityPreviewCardStyles as styles } from "../styles/OaaActivityPreviewCardStyles";

interface OaaActivityPreviewCardProps {
  name: string;
  id: string;
}

export function OaaActivityPreviewCard({ name, id }: OaaActivityPreviewCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(backendUrl + "/images/activities/" + id + ".jpg");

  const onFallback = () => {
    setImageSrc(backendUrl + "/images/activities/placeholder_large.jpg");
  };

  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        <Image style={styles.image} resizeMode={"cover"} source={{ uri: imageSrc }} onError={() => onFallback()} />
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </View>
  );
}
