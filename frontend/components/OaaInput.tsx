import { KeyboardTypeOptions, TextInput, View, Text } from "react-native";
import * as React from "react";
import { ooaInputStyles as styles } from "../styles/ooaInputStyles";
import { appColors, primary } from "../styles/StyleAttributes";
import { useEffect, useState } from "react";

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
}

export function OaaInput({
  value,
  placeholder,
  onChangeText,
  onEndEditing,
  keyboardType,
  secureTextEntry,
  isValid = false,
  isError = false,
  errorMessage,
}: OaaInputProps) {
  const [borderColor, setBorderColor] = useState(primary["200"]);

  const setColor = (focused: boolean = false) => {
    if (focused) return setBorderColor(primary["700"]);
    if (isValid) return setBorderColor(appColors.valid);
    if (isError) return setBorderColor(appColors.error);
    return setBorderColor(primary["200"]);
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { borderColor: borderColor }]}
        placeholderTextColor={primary["200"]}
        value={value}
        placeholder={placeholder}
        onBlur={() => setColor()}
        onFocus={() => setColor(true)}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
      />
      {isError && errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
}
