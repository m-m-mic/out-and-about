import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaInput } from "../components/OaaInput";
import { useContext, useEffect, useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import { ActivityType, SearchStackType } from "../scripts/types";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OaaButton } from "../components/OaaButton";
import { showToast } from "../scripts/showToast";
import { AuthContext } from "../App";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

type SearchProps = NativeStackScreenProps<SearchStackType, "Search">;

export default function Search({ navigation }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchFiltered, setIsSearchFiltered] = useState<boolean>(true);
  const [isSearchResults, setIsSearchResults] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
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
  const insets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext);

  // Fetches results on page load
  useEffect(() => {
    setIsLocationGranted(!!getLocation());
    setCurrentPage(0);
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
    setCurrentPage(0);
    await getResults(0);
    setRefreshing(false);
  };

  // Fetches results from backend
  // page dictates which page of the results should be fetched
  // filtered dictates whether the results should be filtered based on user preferences
  // if useMapRegion is true the current position of the map is used instead of the userLocation
  const getResults = async (page = currentPage, filtered = isSearchFiltered, useMapRegion = false) => {
    setIsNewSearchPromptVisible(false);
    if (page === 0) setLoading(true);
    const location = await getLocation();
    if (!location) {
      setIsLocationGranted(false);
      return;
    }
    setUserLocation(location);
    let coordinates = { lat: location?.coords.latitude, long: location?.coords.longitude };
    if (useMapRegion && mapCoordinates) coordinates = { lat: mapCoordinates.latitude, long: mapCoordinates.longitude };
    const token = await getItemAsync("userToken");
    if (!token) signOut();
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
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data: { activities: ActivityType[]; last_page: boolean } = await response.json();
        if (page === 0) {
          setResults(data.activities);
        } else {
          setResults([...results, ...data.activities]);
        }
        // Sets coordinates of search to startCoordinates
        setStartCoordinates(coordinates);
        // Disables the activityPopup on the map if no results were returned
        if (data.activities.length > 0) {
          setActivityPopup(data.activities[0]);
          setIsActivityPopupVisible(true);
        } else {
          setActivityPopup(undefined);
        }
        setCurrentPage(page + 1);
        setIsLastPage(data.last_page);
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Ergebnisse konnten nicht geladen werden");
      }
    } catch (error) {
      showToast("Ergebnisse konnten nicht geladen werden");
    }
    setIsSearchFiltered(filtered);
    setLoading(false);
    setRefreshing(false);
  };

  // Prompts user to enable location permissions
  if (!isLocationGranted) {
    return <LocationRequest />;
  }

  // Returns list view of results
  const resultsListView = () => {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={loading && { flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <View style={[PageStyles.page, { marginTop: -16, flex: 1 }]}>
              {results.length > 0 ? (
                results.map((activity: ActivityType) => (
                  <OaaActivityCard key={activity._id} activity={activity} navigation={navigation} expanded />
                ))
              ) : (
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, gap: 16 }}>
                  <Icon name="alert-circle" size={48} color={appColors.body} />
                  <Text style={PageStyles.h2}>Keine Ergebnisse gefunden.</Text>
                </View>
              )}
            </View>
            {!isLastPage && <OaaButton label="Weitere Ergebnisse laden" variant="ghost" onPress={() => getResults()} />}
          </>
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
                setCurrentPage(0);
                getResults(0, isSearchFiltered, true);
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
            style={{ width: "100%", height: "100%" }}>
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
          {
            marginTop: insets.top,
            marginLeft: insets.left,
            marginRight: insets.right,
            borderBottomEndRadius: 12,
            borderBottomStartRadius: 12,
            backgroundColor: appColors.background,
            zIndex: 5,
          },
        ]}>
        <Text style={PageStyles.h1}>Suche</Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <OaaInput
            icon="magnify"
            placeholder="Hier Suchbegriff eingeben..."
            onChangeText={(value: string) => setSearchTerm(value)}
            onEndEditing={() => {
              setCurrentPage(0);
              getResults(0);
            }}
          />
        </View>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={PageStyles.h2}>{isSearchResults ? "Ergebnisse" : "In deiner Nähe"}</Text>
          <OaaIconButton
            name={isSearchFiltered ? "filter-off" : "filter"}
            disabled={loading}
            onPress={() => {
              setCurrentPage(0);
              if (isSearchFiltered) {
                showToast("Filter deaktiviert");
              } else {
                showToast("Aktivitäten werden gefiltert");
              }
              getResults(0, !isSearchFiltered);
            }}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 8, width: "100%" }}>
          <OaaChip
            label="Liste"
            variant={isMapView ? "outline" : "primary"}
            size="medium"
            expand
            onPress={() => setIsMapView(false)}
          />
          <OaaChip
            label="Karte"
            variant={!isMapView ? "outline" : "primary"}
            size="medium"
            expand
            onPress={() => setIsMapView(true)}
          />
        </View>
      </View>
      {isMapView ? resultsMapView() : resultsListView()}
    </>
  );
}
