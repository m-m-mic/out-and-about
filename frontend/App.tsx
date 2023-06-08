import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createContext, useEffect, useMemo, useReducer } from "react";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { backendUrl } from "./scripts/backendConnection";
import { AuthState, AuthType } from "./scripts/types";
import { loggedInStack, loggedOutStack } from "./layout";

export const AuthContext: React.Context<AuthType> = createContext({} as AuthType);

export default function App() {
  // Auth logic from here: https://reactnavigation.org/docs/auth-flow

  const [state, dispatch] = useReducer(
    (prevState: any, action: { type?: AuthState; token?: string; id?: string }) => {
      switch (action.type) {
        case "RESTORE_DATA":
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
        dispatch({ type: "SIGN_OUT" });
      }
      dispatch({ type: "RESTORE_DATA", token: userToken as string, id: userId as string });
    };

    getStorageToken();
  }, []);

  const authContext: AuthType = useMemo(
    () => ({
      // Sign In fetch request
      signIn: async (data: any) => {
        const url = backendUrl + "/account/login";
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        };
        fetch(url, requestOptions).then((response) => {
          if (response.status === 404) {
            // Error-Handling für falsche E-Mail
            console.log("Wrong E-Mail");
            return;
          } else if (response.status === 403) {
            // Error-Handling für falsche Password
            console.log("Wrong password");
            return;
          }
          response.json().then(async (data) => {
            await setItemAsync("userToken", data.token);
            await setItemAsync("userId", data.id);
            dispatch({ type: "SIGN_IN", token: data.token, id: data.id });
          });
        });
      },
      // Sign out
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      // Sign up fetch request
      signUp: async (data: Object) => {
        const url = backendUrl + "/account/register";
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
        fetch(url, requestOptions).then((response) => {
          if (response.status === 201) {
            response.json().then(async (data) => {
              await setItemAsync("userToken", data.token);
              await setItemAsync("userId", data.id);
              dispatch({ type: "SIGN_IN", token: data.token, id: data.id });
            });
          } else if (response.status === 503) {
            // TODO: Error handling for no change requests
          } else {
            console.log("Generic error");
            // TODO: Generic error handling
          }
        });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>{state.userToken ? loggedInStack() : loggedOutStack()}</NavigationContainer>
    </AuthContext.Provider>
  );
}
