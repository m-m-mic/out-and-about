import { Button, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../App";
import { backendUrl } from "../scripts/backendConnection";
import { ChoosePreferencesStyles as styles } from "../styles/ChoosePreferencesStyles";
import { Category } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";

// @ts-ignore
export default function ChoosePreferences({ route, navigation }) {
  const [registrationData, setRegistrationData] = useState(route.params.data);
  const [categories, setCategories] = useState<Category[]>([]);
  const { signUp } = React.useContext(AuthContext);

  useEffect(() => {
    getCategories();
  }, []);

  // Adds or removes category from user preferences
  const handleCategoryPress = (category: Category) => {
    let userCategories = registrationData.categories;
    if (userCategories.includes(category)) {
      for (let i = 0; i < userCategories.length; i++) {
        if (userCategories[i] === category) {
          userCategories.splice(i, 1);
        }
      }
    } else {
      userCategories.push(category);
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
    fetch(url, requestOptions).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => setCategories(data));
      }
    });
  };

  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Präferenzen wählen</Text>
      {categories.length > 0 && (
        <View style={styles.categoryContainer}>
          {categories.map((category, key) => (
            <Text
              style={registrationData.categories.includes(category) ? styles.selectedCategory : styles.unselectedCategory}
              key={key}
              onPress={() => handleCategoryPress(category)}>
              {category.name}
            </Text>
          ))}
        </View>
      )}
      <Button title="Weiter" onPress={() => signUp(registrationData)} />
    </View>
  );
}
