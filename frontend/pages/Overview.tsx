import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { useCallback, useState } from "react";
import { Account, ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { OaaActivityCard } from "../components/OaaActivityCard";
import { useFocusEffect } from "@react-navigation/native";
import { NoEntriesDisclaimer } from "../components/NoEntriesDisclaimer";
import { getRandomActivityIcon } from "../scripts/getRandomActivityIcon";

// @ts-ignore
export default function Overview({ navigation }) {
  const [accountInfo, setAccountInfo] = useState<Account>();
  const [recommendations, setRecommendations] = useState<ActivityType[]>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disclaimerIcons, setDisclaimerIcons] = useState<string[]>();

  useFocusEffect(
    useCallback(() => {
      setDisclaimerIcons([getRandomActivityIcon(), getRandomActivityIcon(), getRandomActivityIcon()]);
      getAccountInfo();
      getRecommendations();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getAccountInfo();
    setRefreshing(false);
  };

  const getAccountInfo = async () => {
    const url = backendUrl + "/account/info/";
    const storedToken = await getItemAsync("userToken");
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setAccountInfo(data);
    } else {
      console.log("could not load account data");
    }
  };

  const getRecommendations = async () => {
    const url = backendUrl + "/recommendations/?filtered=false";
    const userToken = await getItemAsync("userToken");
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${userToken}` },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setRecommendations(data);
    }
    // console.log("Oh oh :((((");
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
          onPress={() => navigation.navigate("CreateActivity")}
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
