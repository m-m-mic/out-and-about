import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useCallback, useState, useContext } from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { AccountType, ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { OaaActivityCard } from "../components/OaaActivityCard";
import { useFocusEffect } from "@react-navigation/native";
import { NoEntriesDisclaimer } from "../components/NoEntriesDisclaimer";
import { getLocation } from "../scripts/getLocation";
import { getRandomActivityIcon } from "../scripts/getRandomActivityIcon";
import { LocationRequest } from "./LocationRequest";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LocationObject } from "expo-location";
import { AuthContext } from "../App";
import { showToast } from "../scripts/showToast";

// @ts-ignore
export default function Overview({ navigation }) {
  const [accountActivities, setAccountActivities] = useState<AccountType>();
  const [recommendations, setRecommendations] = useState<ActivityType[]>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disclaimerIcons, setDisclaimerIcons] = useState<string[]>();
  const [isLocationGranted, setIsLocationGranted] = useState<boolean>(true);
  const insets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      setRefreshing(false);
      setDisclaimerIcons([getRandomActivityIcon(), getRandomActivityIcon(), getRandomActivityIcon()]);
      getContent();
    }, [])
  );

  // Performs all required fetch requests for the page to work
  const getContent = async () => {
    const location = await getLocation();
    if (!location) {
      setIsLocationGranted(false);
      return;
    }
    await getAccountActivities(location);
    await getRecommendations(location);
  };

  // Refreshes page if refreshControl is triggered
  const onRefresh = async () => {
    setRefreshing(true);
    await getContent();
    setRefreshing(false);
  };

  // Fetches activities of user
  const getAccountActivities = async (location: LocationObject) => {
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    const url = backendUrl + "/account/activities";
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data = await response.json();
        setAccountActivities(data);
        return;
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Eigene Aktivitäten konnten nicht geladen werden", 5);
      }
    } catch (error) {
      showToast("Eigene Aktivitäten konnten nicht geladen werden", 5);
    }
  };

  // Fetches recommendations for user
  const getRecommendations = async (location: LocationObject) => {
    const url = backendUrl + "/recommendations/?preferences=false";
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data: { activities: ActivityType[]; last_page: boolean } = await response.json();
        setRecommendations(data.activities);
        return;
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Empfehlungen konnten nicht geladen werden");
      }
    } catch (error) {
      showToast("Empfehlungen konnten nicht geladen werden");
    }
  };

  // Displays different page if location permissions weren't granted
  if (!isLocationGranted) {
    return <LocationRequest />;
  }

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={PageStyles.page}>
        <Text style={PageStyles.h1}>Übersicht</Text>
        {accountActivities && recommendations && disclaimerIcons ? (
          <>
            <Text style={PageStyles.h2}>Zugesagt</Text>
            {accountActivities.saved_activities.length > 0 ? (
              <FlatList
                style={{ marginHorizontal: -12, marginVertical: -5 }}
                ItemSeparatorComponent={() => <View style={{ marginLeft: -8 }} />}
                showsHorizontalScrollIndicator={false}
                data={accountActivities.saved_activities}
                horizontal={true}
                renderItem={({ item }) => (
                  <View style={{ marginVertical: 5, marginHorizontal: 12 }}>
                    <OaaActivityCard key={item._id} activity={item} navigation={navigation} />
                  </View>
                )}
              />
            ) : (
              <NoEntriesDisclaimer
                text={"Du hast noch nichts zugesagt. Verwende die Suche, um Aktivitäten in deiner Umgebung zu finden!"}
                icon={disclaimerIcons[0]}
              />
            )}
            <Text style={PageStyles.h2}>Von dir geplant</Text>
            {accountActivities.planned_activities.length > 0 ? (
              <FlatList
                style={{ marginHorizontal: -12, marginVertical: -5 }}
                ItemSeparatorComponent={() => <View style={{ marginLeft: -8 }} />}
                showsHorizontalScrollIndicator={false}
                data={accountActivities.planned_activities}
                horizontal={true}
                renderItem={({ item }) => (
                  <View style={{ marginVertical: 5, marginHorizontal: 12 }}>
                    <OaaActivityCard key={item._id} activity={item} navigation={navigation} />
                  </View>
                )}
              />
            ) : (
              <NoEntriesDisclaimer text={"Du hast noch keinen Aktivitäten geplant."} icon={disclaimerIcons[1]} />
            )}
            <OaaButton
              label="Aktivität erstellen"
              icon="plus"
              variant="ghost"
              onPress={() =>
                navigation.navigate("ActivityStack", {
                  screen: "CreateActivity",
                  params: { stackOrigin: "Overview" },
                })
              }
            />
            <Text style={PageStyles.h2}>In deiner Nähe</Text>
            {recommendations.length > 0 ? (
              <FlatList
                style={{ marginHorizontal: -12, marginVertical: -5 }}
                ItemSeparatorComponent={() => <View style={{ marginLeft: -8 }} />}
                showsHorizontalScrollIndicator={false}
                data={recommendations}
                horizontal={true}
                renderItem={({ item }) => (
                  <View style={{ marginVertical: 5, marginHorizontal: 12 }}>
                    <OaaActivityCard key={item._id} activity={item} navigation={navigation} />
                  </View>
                )}
              />
            ) : (
              <NoEntriesDisclaimer
                text={"Es konnten keinen keine Aktivitäten in deiner Nähe gefunden werden."}
                icon={disclaimerIcons[2]}
              />
            )}
          </>
        ) : (
          <Loading padding />
        )}
      </View>
    </ScrollView>
  );
}
