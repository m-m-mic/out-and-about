import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { ActivityType, ActivityValidatorType, Category } from "../scripts/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaInput } from "./OaaInput";
import { OaaChip } from "./OaaChip";
import { setInformationTextInput, setMaximumParticipantsInput, setNameInput } from "../scripts/inputValidators";
import { backendUrl } from "../scripts/backendConnection";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { OaaButton } from "./OaaButton";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import { OaaIconButton } from "./OaaIconButton";
import { getItemAsync } from "expo-secure-store";

interface ModifyActivityProps {
  activityInfo: ActivityType;
  setActivityInfo: Dispatch<SetStateAction<ActivityType>>;
  validation: ActivityValidatorType;
  setValidation: Dispatch<SetStateAction<ActivityValidatorType>>;
  editMode?: boolean;
  navigation: any;
}

export default function ModifyActivity({
  activityInfo,
  setActivityInfo,
  validation,
  setValidation,
  editMode = false,
  navigation,
}: ModifyActivityProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activityCategories, setActivityCategories] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  // Adds or removes category from user preferences
  const handleCategoryPress = (categoryId: string) => {
    let updatedCategories = activityCategories;
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
    setActivityInfo({ ...activityInfo, categories: updatedCategories });
    setActivityCategories(updatedCategories);
  };

  const getCategories = () => {
    const url = backendUrl + "/category";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(url, requestOptions).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          setCategories(data);
        });
      }
    });
  };

  const createActivity = async () => {
    const url = backendUrl + "/activity";
    const token = await getItemAsync("userToken");
    const requestOptions = {
      method: "PUSH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityInfo),
    };
    const response = await fetch(url, requestOptions);
    if (response.status == 201) {
      const data: ActivityType = await response.json();
      navigation.navigate("Activity", { id: data._id });
    }
  };

  const updateActivity = async () => {
    const url = backendUrl + "/activity/" + activityInfo._id;
    const token = await getItemAsync("userToken");
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityInfo),
    };
    const response = await fetch(url, requestOptions);
    if (response.status == 200) {
      navigation.navigate("Activity", { id: activityInfo._id });
    } else {
      console.log(response);
    }
  };

  const runValidators = () => {
    for (const [key, value] of Object.entries(validation)) {
      if (value === false) {
        return false;
      }
    }
    return true;
  };

  const handleConfirmation = async () => {
    runValidators();
    if (editMode) {
      updateActivity();
    } else {
      createActivity();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" onPress={() => navigation.goBack()} />
        {runValidators() ? (
          <OaaIconButton name="check" onPress={() => handleConfirmation()} />
        ) : (
          <OaaIconButton name="check" disabled={true} />
        )}
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={PageStyles.page}>
          <Text style={PageStyles.h1}>{editMode ? "Aktivität bearbeiten" : "Aktivität erstellen"}</Text>
          <Text style={PageStyles.h2}>Titel</Text>
          <OaaInput
            defaultValue={activityInfo.name}
            placeholder="Titel..."
            onChangeText={(value: string) => setNameInput(value, activityInfo, setActivityInfo, validation, setValidation)}
            isError={validation.name === false}
            isValid={validation.name}
          />
          <Text style={PageStyles.h2}>Kategorien</Text>
          {categories.length > 0 && (
            <View style={PageStyles.categorySelection}>
              {categories.map((category, key) => (
                <OaaChip
                  label={category.name}
                  variant={activityInfo.categories.includes(category) ? "primary" : "unselected"}
                  key={key}
                  onPress={() => handleCategoryPress(category._id)}
                />
              ))}
            </View>
          )}
          <Text style={PageStyles.body}>Wähle bis zu drei aus.</Text>
          <Text style={PageStyles.h2}>Wann?</Text>
          <OaaButton label="Date" onPress={() => setShowDatePicker(true)} />
          <OaaButton label="Time" onPress={() => setShowTimePicker(true)} />
          {showDatePicker && (
            <RNDateTimePicker
              display="spinner"
              mode="date"
              value={new Date(activityInfo.date)}
              minimumDate={new Date()}
              onChange={(event, date) => {
                date && setActivityInfo({ ...activityInfo, date: date.valueOf() });
                setShowDatePicker(false);
              }}
            />
          )}
          {showTimePicker && (
            <RNDateTimePicker
              display="spinner"
              mode="time"
              value={new Date(activityInfo.date)}
              minimumDate={new Date()}
              onChange={(event, date) => {
                date && setActivityInfo({ ...activityInfo, date: date.valueOf() });
                setShowTimePicker(false);
              }}
            />
          )}
          <Text style={PageStyles.h2}>Wo?</Text>
          <Text style={PageStyles.h2}>Wie viele?</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ width: 100 }}>
              <OaaInput
                defaultValue={activityInfo.maximum_participants > 0 ? activityInfo.maximum_participants.toString() : ""}
                placeholder="100"
                onChangeText={(value: string) =>
                  setMaximumParticipantsInput(
                    value,
                    activityInfo,
                    setActivityInfo,
                    validation,
                    setValidation,
                    activityInfo.participants.length
                  )
                }
                keyboardType="numeric"
                isError={validation.maximum_participants === false}
                isValid={validation.maximum_participants}
              />
            </View>
            <Text style={PageStyles.body}> Personen</Text>
            {editMode && <OaaChip label={`${activityInfo.participants.length} Zusagen`} size="small" variant="caution" />}
          </View>
          <Text style={PageStyles.h2}>Weitere Informationen</Text>
          <OaaInput
            defaultValue={activityInfo.information_text}
            placeholder="Zusätzliche Informationen zu der Aktivität"
            onChangeText={(value: string) =>
              setInformationTextInput(value, activityInfo, setActivityInfo, validation, setValidation)
            }
            customHeight={200}
            textAlignVertical="top"
            isError={validation.information_text === false}
            isValid={validation.information_text}
            multiline={true}
          />
        </View>
      </ScrollView>
    </View>
  );
}
