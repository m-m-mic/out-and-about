import { BackHandler, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityStackType, ActivityType } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { OaaChip } from "../components/OaaChip";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaActivityImage } from "../components/OaaActivityImage";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { getGeocodeString } from "../scripts/getGeocodeString";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { AuthContext } from "../App";
import { showToast } from "../scripts/showToast";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { MapModal } from "../components/MapModal";
import { IconButton } from "@react-native-material/core";

type ActivityProps = NativeStackScreenProps<ActivityStackType, "Activity">;

export default function Activity({ route, navigation }: ActivityProps) {
  const [activityInfo, setActivityInfo] = useState<ActivityType | null>(null);
  const [geocode, setGeocode] = useState<string | undefined>();
  const [isOwner, setOwner] = useState(false);
  const [isParticipant, setParticipant] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isChangingUserRelation, setIsChangingUserRelation] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isActivityFull, setIsActivityFull] = useState<boolean>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const id = route.params.id;
  const { signOut } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      getActivityInfo();
      return () => backHandler.remove();
    }, [])
  );

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  // Fetches activity data from backend
  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + id;
    const token = await getItemAsync("userToken");
    const userId = await getItemAsync("userId");
    if (!token || !userId) signOut();
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data: ActivityType = await response.json();
        // Turns activity location into a readable string
        const geocodeString = await getGeocodeString(data.location.coordinates[0], data.location.coordinates[1]);
        setGeocode(geocodeString);
        setActivityInfo(data);
        setRelations(data, userId);
        setIsActivityFull(data.participants.length >= data.maximum_participants);
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Aktivität konnte nicht gefunden werden");
      }
    } catch (error) {
      showToast("Aktivität konnte nicht geladen werden");
    }
  };

  // Assigns role to user (e.g. participant, owner)
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

  // Adds or removes activity from user's saved_activities list
  const changeParticipantSub = async () => {
    const url = backendUrl + "/activity/" + id + "/save";
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        if (activityInfo)
          if (!isParticipant) {
            showToast(`Du hast '${activityInfo.name}' zugesagt`);
            await sendNotification(
              `Du hast '${activityInfo.name}' zugesagt`,
              `Wir sehen uns am ${new Date(activityInfo.date).toLocaleString("de-DE", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}!`
            );
          } else {
            showToast(`Du hast '${activityInfo.name}' abgesagt`);
          }
        await getActivityInfo();
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else if (response.status === 404) {
        showToast("Aktivität konnte nicht gefunden werden");
      } else {
        showToast("Aktion konnte nicht ausgeführt werden");
      }
    } catch (error) {
      showToast("Aktion konnte nicht ausgeführt werden");
    }
  };

  // Dictates what happens if user presses the hover button (e.g. save activity, open participant list...)
  const handleButtonPress = async () => {
    if (isOwner && activityInfo) {
      navigation.navigate("Participants", { id: id, name: activityInfo.name });
    } else {
      setIsChangingUserRelation(true);
      await changeParticipantSub();
      setIsChangingUserRelation(false);
    }
  };

  // Refreshes page if refreshControl is triggered
  const onRefresh = async () => {
    setRefreshing(true);
    await getActivityInfo();
    setRefreshing(false);
  };

  // Dictates how back button behaves. If previous page was createActivity, the back button will go to the root of the stack instead
  const handleBackButton = () => {
    if (route.params.fromCreated) {
      navigation.getParent()?.goBack();
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };

  if (!activityInfo) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}>
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
      <MapModal visible={isModalVisible} setVisible={setIsModalVisible} activities={[activityInfo]} />
      <OaaActivityImage id={id} blur={scrollPosition} />
      <ScrollView
        style={{ flex: 1 }}
        onScroll={(event) => setScrollPosition(Math.round(event.nativeEvent.contentOffset.y / 20))}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[PageStyles.page, styles.mainView]}>
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={[PageStyles.hero, { paddingTop: 8 }]}>{activityInfo.name}</Text>
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
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <View style={{ display: "flex", gap: 16, flex: 1 }}>
              <Text style={PageStyles.h2}>Wo?</Text>
              <Text style={PageStyles.body}>{geocode && geocode}</Text>
            </View>
            <OaaIconButton name="map-marker" rounded={false} variant="primary" onPress={() => setIsModalVisible(true)} />
          </View>
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
