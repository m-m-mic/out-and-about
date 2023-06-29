import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createContext, useEffect, useMemo, useReducer } from "react";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { backendUrl } from "./scripts/backendConnection";
import { AuthState, AuthType } from "./scripts/types";
import { loggedInStack, loggedOutStack } from "./layout";
import { useFonts } from "expo-font";
import { SafeAreaView, StatusBar } from "react-native";
import { appColors, primary } from "./styles/StyleAttributes";
import { IconComponentProvider } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";


export const AuthContext: React.Context<AuthType> = createContext({} as AuthType);
/* 
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
 */
export default function App() {
  // Auth logic from here: https://reactnavigation.org/docs/auth-flow
  let [fontsLoaded] = useFonts({
    NunitoSansRegular: require("./assets/fonts/NunitoSans-Regular.ttf"),
    NunitoSansBoldItalic: require("./assets/fonts/NunitoSans-BoldItalic.ttf"),
    NunitoSansBold: require("./assets/fonts/NunitoSans-Bold.ttf"),
    Righteous: require("./assets/fonts/Righteous-Regular.ttf"),
  });

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
