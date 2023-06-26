import { ActivityType } from "../scripts/types";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, GestureResponderEvent } from "react-native";
import { OaaChip } from "./OaaChip";
import { OaaActivityCardStyles as styles } from "../styles/OaaActivityCardStyles";
import { backendUrl } from "../scripts/backendConnection";
import { formatDistance } from "../scripts/formatDistance";
import { OaaIconButton } from "./OaaIconButton";

interface OaaActivityCardProps {
  activity: ActivityType;
  navigation: any;
  onDismiss?: (event: GestureResponderEvent) => void;
  expanded?: boolean;
}
export function OaaActivityCard({ activity, navigation, expanded, onDismiss }: OaaActivityCardProps) {
  const [imageSrc, setImageSrc] = useState<string>(backendUrl + "/images/activities/" + activity._id + ".jpg");

  useEffect(() => {
    setImageSrc(backendUrl + "/images/activities/" + activity._id + ".jpg");
  }, [activity]);

  const onFallback = () => {
    setImageSrc(backendUrl + "/images/activities/placeholder_large.jpg");
  };

  return (
    <View style={[styles.shadow, { position: "relative", width: "100%" }]}>
      {onDismiss && (
        <View style={{ position: "absolute", right: 12, top: 12, zIndex: 6 }}>
          <OaaIconButton name="close" variant="transparent" onPress={onDismiss} />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, { width: expanded ? "100%" : 320 }]}
        onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id } })}>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {activity.name}
          </Text>
          <View style={styles.chipColumn}>
            <View style={styles.chips}>
              <OaaChip
                label={formatDistance(activity.distance)}
                size="small"
                variant="outline"
                onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id } })}
              />
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
            </View>
            <View style={[styles.chips]}>
              <OaaChip
                label={activity.categories[0].name}
                size="small"
                variant="outline"
                onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id } })}
              />
            </View>
          </View>
        </View>
        <Image style={styles.image} blurRadius={4} resizeMode={"cover"} source={{ uri: imageSrc }} onError={() => onFallback()} />
      </TouchableOpacity>
    </View>
  );
}
