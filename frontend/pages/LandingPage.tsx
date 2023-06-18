import { Dimensions, FlatList, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { appColors } from "../styles/StyleAttributes";
import { useEffect, useState } from "react";
import { ActivityType } from "../scripts/types";
import Loading from "../components/Loading";
import { backendUrl } from "../scripts/backendConnection";
import { OaaActivityPreviewCard } from "../components/OaaActivityPreviewCard";

// @ts-ignore
export default function LandingPage({ navigation }) {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [flatListIndex, setFlatListIndex] = useState<number>(0);
  const width = Dimensions.get("window").width;
  const ref = React.useRef<FlatList>(null);

  useEffect(() => {
    getActivities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      countUpIndex();
      console.log(flatListIndex);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ref.current?.scrollToIndex({
      index: flatListIndex,
      animated: true,
    });
  }, [flatListIndex]);

  const countUpIndex = () => {
    return setFlatListIndex((flatListIndex) => {
      if (flatListIndex < activities.length - 1) {
        flatListIndex++;
      } else {
        flatListIndex = 0;
      }
      return flatListIndex;
    });
  };

  const getActivities = async () => {
    setLoading(true);
    const url = backendUrl + "/landing-page";
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      setActivities(data);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <View style={{ display: "flex", gap: 16 }}>
          <Text style={PageStyles.hero}>OUT & ABOUT</Text>
          <Text style={[PageStyles.h1, { color: appColors.body }]}>
            Raus aus dem Haus!{"\n"}Bei uns findest du schnell und einfach Aktivitäten und Events in deiner Nähe.
          </Text>
        </View>
        {activities.length > 0 && (
          <FlatList
            ref={ref}
            style={{ marginHorizontal: -12 }}
            data={activities}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  display: "flex",
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <OaaActivityPreviewCard name={item.name} id={item._id} key={item._id} />
              </View>
            )}
          />
        )}
        {loading && <Loading />}
        <View style={{ display: "flex", gap: 16 }}>
          <OaaButton label="Registrieren" onPress={() => navigation.navigate("Register")} />
          <OaaButton label="Anmelden" variant="outline" onPress={() => navigation.navigate("Login")} />
        </View>
      </View>
    </ScrollView>
  );
}
