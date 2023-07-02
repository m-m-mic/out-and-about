import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";

export function OaaAccountImage({ size, id }: { size: number; id?: string }) {
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

  // Gets image from backend
  const getImageUri = async () => {
    let accountId: string | undefined = id;
    if (!id) accountId = (await getItemAsync("userId")) as string;
    setImageSrc(backendUrl + "/images/accounts/" + accountId + ".jpg");
  };

  // Placeholder fallback if account image is unavailable
  const onFallback = () => {
    setImageSrc(backendUrl + "/images/accounts/placeholder_small.jpg");
  };

  if (imageSrc) {
    return <Image style={styles.image} resizeMode={"contain"} source={{ uri: imageSrc }} onError={() => onFallback()} />;
  } else return null;
}
