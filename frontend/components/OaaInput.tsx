import {
  KeyboardTypeOptions,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native";
import * as React from "react";
import { OaaInputStyles as styles } from "../styles/OaaInputStyles";
import { appColors, primary } from "../styles/StyleAttributes";
import { useEffect, useState } from "react";
import { Icon } from "@react-native-material/core";

interface OaaInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  isValid?: boolean;
  isError?: boolean;
  errorMessage?: string;
  icon?: string;
  defaultValue?: string;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: "center" | "bottom" | "top" | "auto";
}

export function OaaInput({
  value,
  placeholder,
  onChangeText,
  onEndEditing,
  keyboardType,
  secureTextEntry = false,
  isValid = false,
  isError = false,
  errorMessage,
  icon,
  defaultValue,
  multiline = false,
  numberOfLines = 1,
  textAlignVertical,
}: OaaInputProps) {
  const [borderColor, setBorderColor] = useState(primary["200"]);
  const [hideTextEntry, setHideTextEntry] = useState(secureTextEntry);

  useEffect(() => {
    setColor();
  }, [isValid, isError]);

  // Sets color of border based on state
  const setColor = (focused: boolean = false) => {
    if (focused) return setBorderColor(primary["700"]);
    if (isValid) return setBorderColor(appColors.valid);
    if (isError) return setBorderColor(appColors.error);
    return setBorderColor(primary["200"]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, { borderColor: borderColor }]}>
        {icon && <Icon name={icon} color={appColors.body} size={24} />}
        <TextInput
          defaultValue={defaultValue}
          keyboardType={keyboardType}
          secureTextEntry={hideTextEntry}
          style={[styles.input, { height: 30 * numberOfLines }]}
          placeholderTextColor={primary["200"]}
          value={value}
          placeholder={placeholder}
          multiline={multiline}
          onBlur={() => setColor()}
          onFocus={() => setColor(true)}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          textAlignVertical={textAlignVertical}
        />
        {(isValid || isError) && (
          <Icon name={isValid ? "check" : "close"} color={isValid ? appColors.valid : appColors.error} size={24} />
        )}
        {secureTextEntry && (
          <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 3 }} onPress={() => setHideTextEntry(!hideTextEntry)}>
            <Icon name={hideTextEntry ? "eye-outline" : "eye-off-outline"} color={primary["200"]} size={24} />
          </TouchableOpacity>
        )}
      </View>
      {isError && errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
}
