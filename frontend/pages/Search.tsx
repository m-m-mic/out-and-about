import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { getLocation } from "../scripts/getLocation";
import { LocationRequest } from "./LocationRequest";
import { OaaChip } from "../components/OaaChip";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { appColors, primary } from "../styles/StyleAttributes";
import { LocationObject } from "expo-location";
import { SearchStyles as styles } from "../styles/SearchStyles";
import { getDistance } from "geolib";
import { Icon } from "@react-native-material/core";

export default function Search({ navigation }: any) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<boolean>(true);
  const [isSearchResults, setIsSearchResults] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [results, setResults] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLocationGranted, setIsLocationGranted] = useState<boolean>(true);
  const [isMapView, setIsMapView] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationObject>();
  const [activityPopup, setActivityPopup] = useState<ActivityType>();
  const [isActivityPopupVisible, setIsActivityPopupVisible] = useState<boolean>(true);
  const [startCoordinates, setStartCoordinates] = useState<{ long: number; lat: number }>();
  const [mapCoordinates, setMapCoordinates] = useState<Region>();
  const [isNewSearchPromptVisible, setIsNewSearchPromptVisible] = useState<boolean>(false);

  // Fetches results on page load
  useEffect(() => {
    setIsLocationGranted(!!getLocation());
    setPage(0);
    getResults(0);
  }, []);

  // Checks if current map position is more than 5000 meters away from search position
  // If yes, the "search here" prompt shows up on the map
  // Gets triggered whenever mapCoordinates changes
  useEffect(() => {
    if (startCoordinates && mapCoordinates) {
      if (
        // Checks if distance is greater than 5000 m
        getDistance(
          { lat: startCoordinates?.lat, lon: startCoordinates?.long },
          { latitude: mapCoordinates?.latitude, longitude: mapCoordinates?.longitude }
        ) > 5000
      ) {
        setIsNewSearchPromptVisible(true);
      } else {
        setIsNewSearchPromptVisible(false);
      }
    }
  }, [mapCoordinates]);

  // Refreshes page if refreshControl is triggered
  const onRefresh = async () => {
    setRefreshing(true);
    await getResults(0);
    setRefreshing(false);
  };

  // Fetches results from backend
  // page dictates which page of the results should be fetched
  // filtered dictates whether the results should be filtered based on user preferences
  // if useMapRegion is true the current position of the map is used instead of the userLocation
  const getResults = async (page: number, filtered = false, useMapRegion = false) => {
    setIsNewSearchPromptVisible(false);
    setLoading(true);
    const location = await getLocation();
    if (!location) {
      setIsLocationGranted(false);
      return;
    }
    setUserLocation(location);
    let coordinates = { lat: location?.coords.latitude, long: location?.coords.longitude };
    if (useMapRegion && mapCoordinates) coordinates = { lat: mapCoordinates.latitude, long: mapCoordinates.longitude };
    const token = await getItemAsync("userToken");
    let url;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(coordinates),
    };
    if (searchTerm.trim().length === 0) {
      // Fetches recommendations if no searchQuery was entered
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
      // Sets coordinates of search to startCoordinates
      setStartCoordinates(coordinates);
      // Disables the activityPopup on the map if no results were returned
      if (data.activities.length > 0) {
        setActivityPopup(data.activities[0]);
        setIsActivityPopupVisible(true);
      } else {
        setActivityPopup(undefined);
      }
      setPage(page + 1);
      setIsLastPage(data.last_page);
    } else {
      console.log("Could not perform search");
    }
    setFiltered(filtered);
    setLoading(false);
  };

  // Prompts user to enable location permissions
  if (!isLocationGranted) {
    return <LocationRequest />;
  }

  // Returns list view of results
  const resultsListView = () => {
    return (
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <Loading />
        ) : (
          <View style={[PageStyles.page, { marginTop: -16, flex: 1 }]}>
            {results.length > 0 ? (
              results.map((activity: ActivityType) => (
                <OaaActivityCard key={activity._id} activity={activity} navigation={navigation} expanded />
              ))
            ) : (
              <Text>Keine Ergebnisse gefunden.</Text>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  // Returns map view of results
  const resultsMapView = () => {
    return (
      <View style={{ marginTop: -16, height: "100%", flex: 1 }}>
        {isNewSearchPromptVisible && (
          <View style={styles.absoluteDisclaimer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.searchPrompt}
              onPress={() => {
                setPage(0);
                getResults(0, filtered, true);
              }}>
              <Icon name="magnify" color={appColors.body} size={24} />
              <Text style={PageStyles.body}>Hier suchen</Text>
            </TouchableOpacity>
          </View>
        )}
        {isActivityPopupVisible && activityPopup && (
          <View style={styles.absoluteBox}>
            <OaaActivityCard
              activity={activityPopup}
              navigation={navigation}
              expanded={true}
              onDismiss={() => setIsActivityPopupVisible(false)}
            />
          </View>
        )}
        {!activityPopup && (
          <View style={[styles.absoluteBox, styles.noResults]}>
            <Text style={PageStyles.body}>Keine Ergebnisse gefunden.</Text>
          </View>
        )}
        {userLocation?.coords.longitude && userLocation.coords.latitude && (
          <MapView
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: results.length > 0 ? results[0].location.coordinates[1] : userLocation.coords.latitude,
              longitude: results.length > 0 ? results[0].location.coordinates[0] : userLocation.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.00001,
            }}
            onRegionChange={(region) => setMapCoordinates(region)}
            style={{ width: "100%", height: "100%", minHeight: 400 }}>
            {results.length > 0 &&
              results.map((activity: ActivityType) => (
                <Marker
                  key={activity._id}
                  pinColor={primary["400"]}
                  coordinate={{ longitude: activity.location.coordinates[0], latitude: activity.location.coordinates[1] }}
                  onPress={() => {
                    setIsActivityPopupVisible(true);
                    setActivityPopup(activity);
                  }}
                />
              ))}
          </MapView>
        )}
      </View>
    );
  };

  return (
    <>
      <View
        style={[
          PageStyles.page,
          PageStyles.header,
          { borderBottomEndRadius: 12, borderBottomStartRadius: 12, backgroundColor: appColors.background, zIndex: 5 },
        ]}>
        <Text style={PageStyles.h1}>Suche</Text>
        <OaaInput
          icon="magnify"
          placeholder="Hier Suchbegriff eingeben..."
          onChangeText={(value: string) => setSearchTerm(value)}
          onEndEditing={() => {
            setPage(0);
            getResults(0);
          }}
        />
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={PageStyles.h2}>{isSearchResults ? "Ergebnisse" : "In deiner Nähe"}</Text>
          <OaaIconButton
            name={filtered ? "filter-off" : "filter"}
            disabled={loading}
            onPress={() => {
              setPage(0);
              getResults(0, !filtered);
            }}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <OaaChip label="Liste" variant={isMapView ? "outline" : "primary"} size="medium" onPress={() => setIsMapView(false)} />
          <OaaChip label="Karte" variant={!isMapView ? "outline" : "primary"} size="medium" onPress={() => setIsMapView(true)} />
        </View>
      </View>
      {isMapView ? resultsMapView() : resultsListView()}
    </>
  );
}
