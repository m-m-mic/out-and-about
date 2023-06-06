import { Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";

export default function Activity() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getItemAsync("userToken").then((token) => setToken(token));
  }, []);
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Aktivität</Text>
      {token && <Text>{token}</Text>}
    </View>
  );
}
