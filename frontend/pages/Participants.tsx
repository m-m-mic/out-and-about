import { RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { useCallback, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { appColors, primary } from "../styles/StyleAttributes";
import { OaaAccountImage } from "../components/OaaAccountImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../App";
import { showToast } from "../scripts/showToast";

// @ts-ignore
export default function Participants({ navigation, route }) {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const id = route.params.id;
  const name = route.params.name;
  const insets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      getParticipants();
    }, [])
  );

  // Fetches participant list of activity
  const getParticipants = async () => {
    const url = backendUrl + "/activity/" + id + "/participants";
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data = await response.json();
        setActivityInfo(data);
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Teilnehmerliste konnte nicht geladen werden");
      }
    } catch (error) {
      showToast("Teilnehmerliste konnte nicht geladen werden");
    }
  };

  // Refreshes page if refreshControl is triggered
  const onRefresh = async () => {
    setRefreshing(true);
    getParticipants();
    setRefreshing(false);
  };

  if (!activityInfo) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={PageStyles.page}>
          <Text style={PageStyles.hero}>{name}</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={PageStyles.h1}>Zusagen</Text>
            <Text style={[PageStyles.h1, { color: appColors.body }]}>{activityInfo.participants.length}</Text>
          </View>
          <View>
            {activityInfo.participants.map((participant, index) => (
              <View key={participant._id}>
                <View style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center" }}>
                  <OaaAccountImage size={50} />
                  <View style={{ display: "flex", gap: 2 }}>
                    <Text numberOfLines={1} style={[PageStyles.h1, { color: appColors.body }]}>
                      {participant.username}
                    </Text>
                    <Text numberOfLines={1} style={PageStyles.body}>
                      {participant.email}
                    </Text>
                  </View>
                </View>
                {index < activityInfo.participants.length - 1 && (
                  <View style={{ height: 1, width: "100%", backgroundColor: primary["100"], marginVertical: 10 }}></View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
