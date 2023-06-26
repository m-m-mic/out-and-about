import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { ActivityType, ActivityValidatorType, CategoryType } from "../scripts/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaInput } from "./OaaInput";
import { OaaChip } from "./OaaChip";
import { setDateInput, setInformationTextInput, setMaximumParticipantsInput, setNameInput } from "../scripts/inputValidators";
import { backendUrl } from "../scripts/backendConnection";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { OaaButton } from "./OaaButton";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import { OaaIconButton } from "./OaaIconButton";
import { getItemAsync } from "expo-secure-store";
import { appColors } from "../styles/StyleAttributes";
import Loading from "./Loading";
import { Icon } from "@react-native-material/core";
import { geocodeAsync } from "expo-location";
import { getGeocodeString } from "../scripts/getGeocodeString";

interface ModifyActivityProps {
  activityInfo: ActivityType;
  setActivityInfo: Dispatch<SetStateAction<ActivityType | undefined>>;
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
  const [categories, setCategories] = useState<CategoryType[]>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [geocode, setGeocode] = useState<string | undefined>();
  const [locationValue, setLocationValue] = useState<string | undefined>();

  useEffect(() => {
    getGeocode(activityInfo.location.coordinates[0], activityInfo.location.coordinates[1]);
    getCategories();
  }, []);

  const getGeocode = async (latitude?: number, longitude?: number) => {
    if (!latitude || !longitude) {
      return setGeocode(undefined);
    }
    const geocodeString = await getGeocodeString(latitude, longitude);
    if (geocodeString != locationValue) {
      if (!locationValue) {
        setLocationValue(geocodeString);
        setGeocode(undefined);
      } else {
        setGeocode(geocodeString);
      }
    } else {
      setGeocode(undefined);
    }
  };

  // Adds or removes category from user preferences
  const handleCategoryPress = (category: CategoryType) => {
    let updatedCategories = activityInfo.categories;
    if (isCategoryIdIncluded(updatedCategories, category)) {
      for (let i = 0; i < updatedCategories.length; i++) {
        if (updatedCategories[i]._id === category._id) {
          updatedCategories.splice(i, 1);
        }
      }
    } else {
      updatedCategories?.push(category);
    }
    if (updatedCategories.length > 0) {
      setValidation({ ...validation, categories: true });
    } else {
      setValidation({ ...validation, categories: false });
    }
    // @ts-ignore
    setActivityInfo({ ...activityInfo, categories: updatedCategories });
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityInfo),
    };
    const response = await fetch(url, requestOptions);
    if (response.status == 201) {
      const data: ActivityType = await response.json();
      console.log(data);
      navigation.navigate("Activity", { id: data._id, fromCreated: true });
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

  const deleteActivity = async () => {
    const url = backendUrl + "/activity/" + activityInfo._id;
    const token = await getItemAsync("userToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityInfo),
    };
    const response = await fetch(url, requestOptions);
    if (response.status == 200) {
      navigation.getParent().goBack();
    } else {
      console.log(response);
    }
  };

  const validateLocation = async () => {
    if (locationValue) {
      const location = await geocodeAsync(locationValue);
      if (location.length > 0) {
        setActivityInfo({
          ...activityInfo,
          location: { ...activityInfo.location, coordinates: [location[0].latitude, location[0].longitude] },
        });
        await getGeocode(location[0].latitude, location[0].longitude);
        setValidation({ ...validation, location: true });
      } else {
        await getGeocode();
        setValidation({ ...validation, location: false });
      }
    } else {
      await getGeocode();
      setValidation({ ...validation, location: false });
    }
  };

  const areInputsValid = () => {
    for (const value of Object.values(validation)) {
      if (!value) {
        return false;
      }
    }
    return true;
  };

  const handleConfirmation = async () => {
    if (editMode) {
      updateActivity();
    } else {
      createActivity();
    }
  };

  const isCategoryIdIncluded = (categoryList: CategoryType[], category: CategoryType): boolean => {
    return categoryList.filter((e) => e._id === category._id).length > 0;
  };

  if (!categories) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" onPress={() => navigation.goBack()} />
        <OaaIconButton name="check" disabled={!areInputsValid()} onPress={() => handleConfirmation()} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={PageStyles.page}>
          <Text style={PageStyles.h1}>{editMode ? "Aktivität bearbeiten" : "Aktivität erstellen"}</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text style={PageStyles.h2}>Titel</Text>
            <Text style={[PageStyles.h2, { color: appColors.error }]}>*</Text>
          </View>
          <OaaInput
            defaultValue={activityInfo.name}
            placeholder="Titel..."
            onChangeText={(value: string) => setNameInput(value, activityInfo, setActivityInfo, validation, setValidation)}
            isError={validation.name === false}
            isValid={validation.name}
            errorMessage="Titel muss 1 bis 30 Zeichen lang sein."
          />
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text style={PageStyles.h2}>Kategorien</Text>
            <Text style={[PageStyles.h2, { color: appColors.error }]}>*</Text>
          </View>
          {categories.length > 0 && (
            <View style={PageStyles.categorySelection}>
              {categories.map((category, key) => (
                <OaaChip
                  label={category.name}
                  variant={
                    isCategoryIdIncluded(activityInfo.categories, category)
                      ? "primary"
                      : activityInfo.categories.length >= 3
                      ? "disabled"
                      : "unselected"
                  }
                  key={key}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "flex-end",
              height: 25,
            }}>
            {validation.categories === false && <Icon name="alert-circle" size={24} color={appColors.error} />}
            <Text style={[PageStyles.body, !validation.categories && { color: appColors.error }]}>Wähle eins bis drei aus.</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text style={PageStyles.h2}>Wann?</Text>
            <Text style={[PageStyles.h2, { color: appColors.error }]}>*</Text>
          </View>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ display: "flex", flexDirection: "row", gap: 12, maxWidth: 320, width: "100%" }}>
              <View style={{ flex: 0.6 }}>
                <OaaButton
                  label={new Date(activityInfo.date).toLocaleString("de-DE", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                  variant="outline"
                  onPress={() => setShowDatePicker(true)}
                />
              </View>
              <View style={{ flex: 0.4 }}>
                <OaaButton
                  label={new Date(activityInfo.date).toLocaleString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  variant="outline"
                  onPress={() => setShowTimePicker(true)}
                />
              </View>
            </View>
          </View>
          {showDatePicker && (
            <RNDateTimePicker
              display="spinner"
              mode="date"
              value={new Date(activityInfo.date)}
              positiveButton={{ label: "Bestätigen" }}
              negativeButton={{ label: "Abbrechen" }}
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
              positiveButton={{ label: "Bestätigen" }}
              negativeButton={{ label: "Abbrechen" }}
              value={new Date(activityInfo.date)}
              onChange={(event, date) => {
                date && setDateInput(date, activityInfo, setActivityInfo, validation, setValidation);
                setShowTimePicker(false);
              }}
            />
          )}
          {!validation.date && <Text>Datum darf nicht in der Vergangenheit liegen.</Text>}
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text style={PageStyles.h2}>Wo?</Text>
            <Text style={[PageStyles.h2, { color: appColors.error }]}>*</Text>
          </View>
          <OaaInput
            placeholder="Geb hier eine Adresse ein..."
            value={locationValue}
            onChangeText={(value: string) => setLocationValue(value)}
            onEndEditing={() => validateLocation()}
            isValid={validation.location}
            isError={validation.location === false}
            errorMessage="Eingegebene Adresse ist inkorrekt."
          />
          {geocode && <Text style={PageStyles.body}>Exakt: {geocode}</Text>}
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text style={PageStyles.h2}>Wie viele?</Text>
            <Text style={[PageStyles.h2, { color: appColors.error }]}>*</Text>
          </View>
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
            {editMode && (
              <OaaChip
                label={`${activityInfo.participants.length} ${activityInfo.participants.length === 1 ? "Zusage" : "Zusagen"}`}
                size="small"
                variant="caution"
              />
            )}
          </View>
          <Text style={PageStyles.h2}>Weitere Informationen</Text>
          <OaaInput
            defaultValue={activityInfo.information_text}
            placeholder="Zusätzliche Informationen zu der Aktivität"
            onChangeText={(value: string) =>
              setInformationTextInput(value, activityInfo, setActivityInfo, validation, setValidation)
            }
            numberOfLines={7}
            textAlignVertical="top"
            isError={validation.information_text === false}
            isValid={validation.information_text}
            multiline={true}
            errorMessage="Weitere Informationen müssen unter 300 Zeichen lang sein."
          />
          {editMode && <OaaButton label="Aktivität löschen" icon="delete" variant="warning" onPress={() => deleteActivity()} />}
        </View>
      </ScrollView>
    </View>
  );
}
