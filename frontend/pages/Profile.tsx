import { RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { PageStyles } from "../styles/PageStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaButton } from "../components/OaaButton";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { useCallback, useState } from "react";
import { appColors } from "../styles/StyleAttributes";
import { AccountType, CategoryType, ProfileStackType } from "../scripts/types";
import { OaaChip } from "../components/OaaChip";
import { OaaActivityButton } from "../components/OaaActivityButton";
import { OaaAccountImage } from "../components/OaaAccountImage";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToast } from "../scripts/showToast";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

type ProfileProps = NativeStackScreenProps<ProfileStackType, "Profile">;

export default function Profile({ navigation }: ProfileProps) {
  const [accountInfo, setAccountInfo] = useState<AccountType>();
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [havePreferencesChanged, setHavePreferencesChanged] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const currentTime = new Date().valueOf();
  const { signOut } = React.useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      getAccountInfo();
      getCategories();
    }, [])
  );

  // Refreshes page if refreshControl is triggered
  const onRefresh = async () => {
    setRefreshing(true);
    await getAccountInfo();
    getCategories();
    setRefreshing(false);
  };

  // Updates the category preferences of user
  const updateAccountInfo = async () => {
    const url = backendUrl + "/account/info/";
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    let requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ categories: userCategories }),
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        await getAccountInfo();
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Präferenzen konnte nicht aktualisiert werden");
      }
    } catch (error) {
      showToast("Präferenzen konnte nicht aktualisiert werden");
    }
  };

  // Fetches account data of user
  const getAccountInfo = async () => {
    const url = backendUrl + "/account/info/";
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
        const data: AccountType = await response.json();
        setAccountInfo(data);
        setUserCategories(data.categories);
        setHavePreferencesChanged(false);
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Profilinformationen konnten nicht geladen werden");
      }
    } catch (error) {
      showToast("Profilinformationen konnten nicht geladen werden");
    }
  };

  // Fetches all available categories
  const getCategories = () => {
    const url = backendUrl + "/category";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    try {
      fetch(url, requestOptions).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => setCategories(data));
        } else {
          showToast("Kategorien konnten nicht geladen werden");
        }
      });
    } catch (error) {
      showToast("Kategorien konnten nicht geladen werden");
    }
  };

  // Decides whether pressed category should be added or removed from preferences
  const handleCategoryPress = (categoryId: string) => {
    let updatedCategories = userCategories;
    if (updatedCategories?.includes(categoryId)) {
      for (let i = 0; i < updatedCategories.length; i++) {
        if (updatedCategories[i] === categoryId) {
          updatedCategories.splice(i, 1);
        }
      }
    } else {
      updatedCategories?.push(categoryId);
    }
    // @ts-ignore
    setAccountInfo({ ...accountInfo, categories: updatedCategories });
    setUserCategories(updatedCategories);
    setHavePreferencesChanged(true);
  };

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={PageStyles.page}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={PageStyles.h1}>Profil</Text>
          <OaaIconButton name="cog" onPress={() => navigation.navigate("Settings")} />
        </View>
        {accountInfo && categories && !refreshing ? (
          <>
            <View style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center" }}>
              <OaaAccountImage size={50} />
              <View style={{ display: "flex", gap: 2 }}>
                <Text numberOfLines={1} style={[PageStyles.h1, { color: appColors.body }]}>
                  {accountInfo?.username}
                </Text>
                <Text numberOfLines={1} style={PageStyles.body}>
                  {accountInfo?.email}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 32,
              }}>
              <Text style={PageStyles.h2}>Präferenzen</Text>
              {havePreferencesChanged && <OaaIconButton name="check" onPress={() => updateAccountInfo()} />}
            </View>
            <View style={PageStyles.categorySelection}>
              {categories.map((category, key) => (
                <OaaChip
                  label={category.name}
                  variant={userCategories.includes(category._id) ? "primary" : "unselected"}
                  key={key}
                  onPress={() => handleCategoryPress(category._id)}
                />
              ))}
            </View>
            <Text style={PageStyles.h2}>Von dir erstellte Aktivitäten</Text>
            <OaaButton
              label="Aktivität erstellen"
              icon="plus"
              variant="outline"
              onPress={() => navigation.navigate("ActivityStack", { screen: "CreateActivity" })}
            />
            {accountInfo?.planned_activities &&
              accountInfo?.planned_activities.length > 0 &&
              accountInfo?.planned_activities.map((activity) => (
                <OaaActivityButton
                  key={activity._id}
                  label={activity.name}
                  active={activity.date > currentTime}
                  id={activity._id as string}
                  onPress={() =>
                    navigation.navigate("ActivityStack", { screen: "Activity", params: { id: activity._id as string } })
                  }
                />
              ))}
          </>
        ) : (
          <Loading padding />
        )}
      </View>
    </ScrollView>
  );
}
