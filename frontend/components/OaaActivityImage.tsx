import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { backendUrl } from "../scripts/backendConnection";

export function OaaActivityImage({ id, blur = 0 }: { id: string; blur: number }) {
  const [imageSrc, setImageSrc] = useState<string>(backendUrl + "/images/activities/" + id + ".jpg");

  const styles = StyleSheet.create({
    image: {
      width: "100%",
      height: 200,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 0,
    },
  });

  // Fallback if activity image is unavailable
  const onFallback = () => {
    setImageSrc(backendUrl + "/images/activities/placeholder_large.jpg");
  };

  return (
    <Image style={styles.image} blurRadius={blur} resizeMode={"cover"} source={{ uri: imageSrc }} onError={() => onFallback()} />
  );
}
