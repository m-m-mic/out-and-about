import { ActivityType } from "../scripts/types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { OaaChip } from "./OaaChip";
import { OaaActivityCardStyles as styles } from "../styles/OaaActivityCardStyles";
import { backendUrl } from "../scripts/backendConnection";

interface OaaActivityCardProps {
  activity: ActivityType;
  navigation: any;
  expanded?: boolean;
}
export function OaaActivityCard({ activity, navigation, expanded }: OaaActivityCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(backendUrl + "/images/activities/" + activity._id + ".jpg");

  const onFallback = () => {
    setImageSrc(backendUrl + "/images/activities/placeholder_large.jpg");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, { width: expanded ? "100%" : 320 }]}
      onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id } })}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {activity.name}
        </Text>
        <View style={styles.chips}>
          <OaaChip label="TODO REGION" size="small" variant="outline" />
          <OaaChip
            label={new Date(activity.date).toLocaleString("de-DE", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id } })}
            size="small"
            variant="outline"
          />
          <OaaChip label={activity.categories[0].name} size="small" variant="outline" />
        </View>
      </View>
      <Image style={styles.image} blurRadius={4} resizeMode={"cover"} source={{ uri: imageSrc }} onError={() => onFallback()} />
    </TouchableOpacity>
  );
}
