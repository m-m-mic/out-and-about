import { BackHandler, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityType } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { OaaChip } from "../components/OaaChip";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaActivityImage } from "../components/OaaActivityImage";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { LocationGeocodedAddress, reverseGeocodeAsync } from "expo-location";
import { getGeocodeString } from "../scripts/getGeocodeString";

//@ts-ignore
export default function Activity({ route, navigation }) {
  const [activityInfo, setActivityInfo] = useState<ActivityType | null>(null);
  const [geocode, setGeocode] = useState<string | undefined>();
  const [isOwner, setOwner] = useState(false);
  const [isParticipant, setParticipant] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isChangingUserRelation, setIsChangingUserRelation] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isActivityFull, setIsActivityFull] = useState<boolean>();
  const [fromCreated, setFromCreated] = useState<boolean>(false);
  const id = route.params.id;

  useFocusEffect(
    useCallback(() => {
      if (route.params.fromCreated) setFromCreated(route.params.fromCreated);
      getActivityInfo();
    }, [])
  );

  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + id;
    const storedToken = await getItemAsync("userToken");
    const storedUserId = await getItemAsync("userId");
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data: ActivityType = await response.json();
      const geocodeString = await getGeocodeString(data.location.coordinates[0], data.location.coordinates[1]);
      setGeocode(geocodeString);
      setActivityInfo(data);
      setRelations(data, storedUserId);
      setIsActivityFull(data.participants.length >= data.maximum_participants);
    } else {
      console.log("error 404: activity not found");
    }
  };

  // Entscheidet anhand von activityInfo, welches Verhältnis der Nutzer zur aufgerufenen Aktivität hat
  // z.B. ist er als Teilnehmer angemeldet, oder ein Organisator der Aktivität etc.
  const setRelations = (data: any, userId: any) => {
    if (data.organizer._id === userId) {
      setOwner(true);
    } else {
      if (data.participants.includes(userId)) {
        setParticipant(true);
      } else {
        setParticipant(false);
      }
    }
  };

  const changeParticipantSub = async () => {
    const url = backendUrl + "/activity/" + id + "/save";
    const token = await getItemAsync("userToken");
    let requestOptions;
    if (token) {
      requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        await getActivityInfo();
      } else {
        console.log("error 404: activity not found");
      }
    } else {
      console.log("no token");
    }
  };

  const handleButtonPress = async () => {
    if (isOwner) {
      navigation.navigate("Participants", { id: activityInfo?._id, name: activityInfo?.name });
    } else {
      setIsChangingUserRelation(true);
      await changeParticipantSub();
      await getActivityInfo();
      setIsChangingUserRelation(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getActivityInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => backHandler.remove();
  }, []);

  const handleBackButton = () => {
    if (fromCreated) {
      navigation.getParent().goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };

  if (!activityInfo) {
    return <Loading />;
  }

  return (
    <View style={[{ flex: 1 }, PageStyles.header]}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" variant="transparent" onPress={() => handleBackButton()} />
        {isOwner && (
          <OaaIconButton name="pencil" variant="transparent" onPress={() => navigation.navigate("EditActivity", { id: id })} />
        )}
      </View>
      <View style={styles.absoluteButton}>
        <OaaButton
          expand={false}
          elevation={true}
          variant={
            isChangingUserRelation || (!isParticipant && !isOwner && isActivityFull)
              ? "disabled"
              : isOwner || !isParticipant
              ? "primary"
              : "caution"
          }
          icon={isOwner ? "account" : isParticipant ? "close" : "check"}
          label={isOwner ? "Zusagenliste ansehen" : isParticipant ? "Absagen" : "Zusagen"}
          onPress={handleButtonPress}
        />
      </View>
      <OaaActivityImage id={id} blur={scrollPosition} />
      <ScrollView
        style={{ flex: 1 }}
        onScroll={(event) => setScrollPosition(Math.round(event.nativeEvent.contentOffset.y / 20))}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[PageStyles.page, styles.mainView]}>
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={PageStyles.hero}>{activityInfo.name}</Text>
            {/*@ts-ignore*/}
            <Text style={PageStyles.subtitle}>Organisiert von {activityInfo.organizer?.username}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {activityInfo.categories.map((category, key) => (
              <OaaChip key={key} label={category.name} size="small" />
            ))}
          </View>
          <Text style={PageStyles.h2}>Wann?</Text>
          <Text style={PageStyles.body}>
            {new Date(activityInfo.date).toLocaleString("de-DE", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={PageStyles.h2}>Wo?</Text>
          <Text style={PageStyles.body}>{geocode && geocode}</Text>
          <Text style={PageStyles.h2}>Wie viele?</Text>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Text style={PageStyles.body}>
              {activityInfo.maximum_participants} {activityInfo.maximum_participants === 1 ? "Person" : "Personen"}
            </Text>
            {1 - activityInfo.participants.length / activityInfo.maximum_participants <= 0.2 && (
              <OaaChip
                label={
                  isActivityFull
                    ? "Keine Plätze mehr frei!"
                    : `Noch ${activityInfo.maximum_participants - activityInfo.participants.length} ${
                        activityInfo.participants.length === 1 ? "Platz" : "Plätze"
                      } frei!`
                }
                size="small"
                variant="caution"
              />
            )}
          </View>
          {activityInfo.information_text && (
            <>
              <Text style={PageStyles.h2}>Weitere Informationen</Text>
              <Text style={PageStyles.body}>{activityInfo.information_text}</Text>
            </>
          )}
        </View>
        <View style={{ height: 65 }}></View>
      </ScrollView>
    </View>
  );
}
