import { KeyboardTypeOptions, TextInput, View, Text, TouchableOpacity } from "react-native";
import * as React from "react";
import { ooaInputStyles as styles } from "../styles/ooaInputStyles";
import { appColors, primary } from "../styles/StyleAttributes";
import { useState } from "react";
import { Icon } from "@react-native-material/core";

interface OaaInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: any;
  onEndEditing?: any;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  isValid?: boolean;
  isError?: boolean;
  errorMessage?: string;
  icon?: string;
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
}: OaaInputProps) {
  const [borderColor, setBorderColor] = useState(primary["200"]);
  const [hideTextEntry, setHideTextEntry] = useState(secureTextEntry);

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
          keyboardType={keyboardType}
          secureTextEntry={hideTextEntry}
          style={styles.input}
          placeholderTextColor={primary["200"]}
          value={value}
          placeholder={placeholder}
          onBlur={() => setColor()}
          onFocus={() => setColor(true)}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
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
