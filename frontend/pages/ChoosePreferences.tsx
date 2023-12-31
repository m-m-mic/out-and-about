import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../App";
import { backendUrl } from "../scripts/backendConnection";
import { AccountType, CategoryType, LoggedOutStackType } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaButton } from "../components/OaaButton";
import { OaaChip } from "../components/OaaChip";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showToast } from "../scripts/showToast";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

type ChoosePreferencesProps = NativeStackScreenProps<LoggedOutStackType, "ChoosePreferences">;

export default function ChoosePreferences({ route, navigation }: ChoosePreferencesProps) {
  const [registrationData, setRegistrationData] = useState<AccountType>(route.params.data);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const insets = useSafeAreaInsets();
  const { signUp } = React.useContext(AuthContext);

  useEffect(() => {
    getCategories();
  }, []);

  // Adds or removes category from user preferences
  const handleCategoryPress = (categoryId: string) => {
    let userCategories = registrationData.categories;
    if (userCategories.includes(categoryId)) {
      for (let i = 0; i < userCategories.length; i++) {
        if (userCategories[i] === categoryId) {
          userCategories.splice(i, 1);
        }
      }
    } else {
      userCategories.push(categoryId);
    }
    setRegistrationData({ ...registrationData, categories: userCategories });
  };

  // Fetches available categories from backend
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

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right, marginBottom: insets.bottom }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaIconButton name="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={PageStyles.hero}>Was spricht dich an?</Text>
        </View>
        {categories.length > 0 && (
          <View style={PageStyles.categorySelection}>
            {categories.map((category, key) => (
              <OaaChip
                label={category.name}
                variant={registrationData.categories.includes(category._id) ? "primary" : "unselected"}
                key={key}
                onPress={() => handleCategoryPress(category._id)}
              />
            ))}
          </View>
        )}
        <View>
          <OaaButton label="Los geht's!" onPress={() => signUp(registrationData)} />
        </View>
      </View>
    </ScrollView>
  );
}
