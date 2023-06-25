import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaInput } from "../components/OaaInput";
import { useEffect, useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { OaaActivityCard } from "../components/OaaActivityCard";
import { OaaIconButton } from "../components/OaaIconButton";
import * as Location from "expo-location";

export default function Search({ navigation }: any) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<boolean>(true);
  const [isSearchResults, setIsSearchResults] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [results, setResults] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationObject>();

  useEffect(() => {
    getLocation().then((location) => {
      setPage(0);
      if (location) getResults(0, location);
    });
  }, []);

  useEffect(() => {
    if (location) getResults(0, location);
  }, [filtered]);

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

  const getResults = async (page: number, location: Location.LocationObject) => {
    setLoading(true);
    const token = await getItemAsync("userToken");
    let url;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat: location?.coords.latitude, long: location?.coords.longitude }),
    };
    if (searchTerm.trim().length === 0) {
      setIsSearchResults(false);
      url = backendUrl + "/recommendations/" + "?page=" + page + "&preferences=" + filtered;
    } else {
      setIsSearchResults(true);
      url = backendUrl + "/search/" + searchTerm + "?page=" + page + "&preferences=" + filtered;
    }
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data: { activities: ActivityType[]; last_page: boolean } = await response.json();
      setResults(data.activities);
      setPage(page + 1);
      setIsLastPage(data.last_page);
    } else {
      console.log("Could not perform search");
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={PageStyles.page}>
        <Text style={PageStyles.h1}>Suche</Text>
        <OaaInput
          icon="magnify"
          placeholder="Hier Suchbegriff eingeben..."
          onChangeText={(value: string) => setSearchTerm(value)}
          onEndEditing={() => {
            if (location) {
              setPage(0);
              getResults(0, location);
            }
          }}
        />
        {loading ? (
          <Loading />
        ) : (
          <>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={PageStyles.h2}>{isSearchResults ? "Ergebnisse" : "In deiner Nähe"}</Text>
              <OaaIconButton name={filtered ? "filter-off" : "filter"} onPress={() => setFiltered(!filtered)} />
            </View>
            {results.length > 0 ? (
              results.map((activity: ActivityType) => (
                <OaaActivityCard key={activity._id} activity={activity} navigation={navigation} expanded />
              ))
            ) : (
              <Text>Keine Ergebnisse gefunden.</Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
