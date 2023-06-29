import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
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
import {LocationObject} from "expo-location";


import * as Device from 'expo-device';
import { Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// @ts-ignore
export default function Overview({ navigation }) {
  const [accountActivities, setAccountActivities] = useState<AccountType>();
  const [recommendations, setRecommendations] = useState<ActivityType[]>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disclaimerIcons, setDisclaimerIcons] = useState<string[]>();
  const [isLocationGranted, setIsLocationGranted] = useState<boolean>(true);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setRefreshing(false)
      setDisclaimerIcons([getRandomActivityIcon(), getRandomActivityIcon(), getRandomActivityIcon()]);
      getContent();
    }, [])
  );

  const [expoPushToken, setExpoPushToken] = useState<any>('');
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }


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
    const url = backendUrl + "/account/activities";
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setAccountActivities(data);
    } else {
      console.log(response.status);
    }
  };

  // Fetches recommendations for user
  const getRecommendations = async (location: LocationObject) => {
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

  // Displays different page if location permissions weren't granted
  if (!isLocationGranted) {
    return <LocationRequest />;
  }

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View
          style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
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
