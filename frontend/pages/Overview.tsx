import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { useCallback, useState } from "react";
import { AccountType, ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { OaaActivityCard } from "../components/OaaActivityCard";
import { useFocusEffect } from "@react-navigation/native";
import { NoEntriesDisclaimer } from "../components/NoEntriesDisclaimer";
import { getRandomActivityIcon } from "../scripts/getRandomActivityIcon";
import * as Location from "expo-location";

// @ts-ignore
export default function Overview({ navigation }) {
  const [accountInfo, setAccountInfo] = useState<AccountType>();
  const [recommendations, setRecommendations] = useState<ActivityType[]>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disclaimerIcons, setDisclaimerIcons] = useState<string[]>();
  const [location, setLocation] = useState<Location.LocationObject>();

  useFocusEffect(
    useCallback(() => {
      getLocation().then((location) => {
        setDisclaimerIcons([getRandomActivityIcon(), getRandomActivityIcon(), getRandomActivityIcon()]);
        console.log(location);
        if (location) {
          getRecommendations(location);
          getAccountInfo(location);
        }
      });
    }, [])
  );

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    return location;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await getAccountInfo(location);
      await getRecommendations(location);
    }
    setRefreshing(false);
  };

  const getAccountInfo = async (location: Location.LocationObject) => {
    const url = backendUrl + "/account/activities";
    const storedToken = await getItemAsync("userToken");
    let requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    console.log(url, requestOptions);
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setAccountInfo(data);
    } else {
      console.log("could not load account data");
    }
  };

  const getRecommendations = async (location: Location.LocationObject) => {
    const url = backendUrl + "/recommendations/?preferences=false";
    const token = await getItemAsync("userToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data: { activities: ActivityType[]; last_page: boolean } = await response.json();
      setRecommendations(data.activities);
    } else {
      console.log("Oh oh :((((");
    }
  };

  if (!accountInfo || !recommendations || !disclaimerIcons) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={PageStyles.page}>
        <Text style={PageStyles.h1}>Übersicht</Text>
        <Text style={PageStyles.h2}>Zugesagt</Text>
        {accountInfo.saved_activities.length > 0 ? (
          <FlatList
            style={{ marginHorizontal: -12, marginVertical: -5 }}
            ItemSeparatorComponent={() => <View style={{ marginLeft: -8 }} />}
            showsHorizontalScrollIndicator={false}
            data={accountInfo.saved_activities}
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
        {accountInfo.planned_activities.length > 0 ? (
          <FlatList
            style={{ marginHorizontal: -12, marginVertical: -5 }}
            ItemSeparatorComponent={() => <View style={{ marginLeft: -8 }} />}
            showsHorizontalScrollIndicator={false}
            data={accountInfo.planned_activities}
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
          onPress={() => navigation.navigate("ActivityStack", { screen: "CreateActivity", params: { stackOrigin: "Overview" } })}
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
      </View>
    </ScrollView>
  );
}
