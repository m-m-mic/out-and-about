import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { backendUrl } from "./scripts/backendConnection";
import { AuthState, AuthType } from "./scripts/types";
import { loggedInStack, loggedOutStack } from "./layout";
import { useFonts } from "expo-font";
import { Platform, StatusBar } from "react-native";
import { appColors } from "./styles/StyleAttributes";
import { IconComponentProvider } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const AuthContext: React.Context<AuthType> = createContext({} as AuthType);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Auth logic from here: https://reactnavigation.org/docs/auth-flow
  let [fontsLoaded] = useFonts({
    NunitoSansRegular: require("./assets/fonts/NunitoSans-Regular.ttf"),
    NunitoSansBoldItalic: require("./assets/fonts/NunitoSans-BoldItalic.ttf"),
    NunitoSansBold: require("./assets/fonts/NunitoSans-Bold.ttf"),
    Righteous: require("./assets/fonts/Righteous-Regular.ttf"),
  });

  const [expoPushToken, setExpoPushToken] = useState<any>("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const [state, dispatch] = useReducer(
    (prevState: any, action: { type?: AuthState; token?: string; id?: string }) => {
      switch (action.type) {
        case "RESTORE_CREDENTIALS":
          return {
            ...prevState,
            userToken: action.token,
            userId: action.id,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userId: action.id,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userId: null,
          };
      }
    },
    {
      isSignout: false,
      userToken: null,
      userId: null,
    }
  );

  useEffect(() => {
    // Fetches token from SecureStorage if available
    const getStorageToken = async () => {
      let userToken;
      let userId;
      try {
        userToken = await getItemAsync("userToken");
        userId = await getItemAsync("userId");
      } catch (e) {
        await deleteItemAsync("userToken");
        await deleteItemAsync("userId");
        dispatch({ type: "SIGN_OUT" });
      }
      dispatch({ type: "RESTORE_CREDENTIALS", token: userToken as string, id: userId as string });
    };

    getStorageToken();
  }, []);

  const authContext: AuthType = useMemo(
    () => ({
      // Sign In fetch request
      signIn: async (data: any): Promise<number> => {
        const url = backendUrl + "/account/login";
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        };
        try {
          const response = await fetch(url, requestOptions);
          if (response.status === 200) {
            const credentials = await response.json();
            await setItemAsync("userToken", credentials.token);
            await setItemAsync("userId", credentials.id);
            dispatch({ type: "SIGN_IN", token: credentials.token, id: credentials.id });
          }
          return response.status;
        } catch (error) {
          return 500;
        }
      },
      // Sign out
      signOut: async () => {
        await deleteItemAsync("userToken");
        await deleteItemAsync("userId");
        dispatch({ type: "SIGN_OUT" });
      },
      // Sign up fetch request
      signUp: async (data: Object) => {
        const url = backendUrl + "/account/register";
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
        const response = await fetch(url, requestOptions);
        if (response.status === 201) {
          const credentials = await response.json();
          await setItemAsync("userToken", credentials.token);
          await setItemAsync("userId", credentials.id);
          dispatch({ type: "SIGN_IN", token: credentials.token, id: credentials.id });
        }
        return response.status;
      },
    }),
    []
  );

  if (!fontsLoaded) return null;
  return (
    <AuthContext.Provider value={authContext}>
      {/* @ts-ignore */}
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <StatusBar barStyle="dark-content" backgroundColor={appColors.background} />
        <SafeAreaProvider>
          <NavigationContainer>{state.userToken ? loggedInStack() : loggedOutStack()}</NavigationContainer>
        </SafeAreaProvider>
      </IconComponentProvider>
    </AuthContext.Provider>
  );
}
