import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";

export function OaaAccountImage({ size }: { size: number }) {
  const [imageSrc, setImageSrc] = useState<string | null>();

  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      overflow: "hidden",
      borderRadius: 500,
    },
  });

  useEffect(() => {
    getImageUri();
  }, []);

  const getImageUri = async () => {
    const id = await getItemAsync("userId");
    setImageSrc(backendUrl + "/images/accounts/" + id + ".jpg");
  };
  const onFallback = () => {
    setImageSrc(backendUrl + "/images/accounts/placeholder_small.jpg");
  };

  if (imageSrc) {
    return <Image style={styles.image} resizeMode={"contain"} source={{ uri: imageSrc }} onError={() => onFallback()} />;
  } else return null;
}
