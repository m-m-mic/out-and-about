import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import { createStackNavigator } from "@react-navigation/stack";
import Activity from "./pages/Activity";
import CreateActivity from "./pages/CreateActivity";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import ChoosePreferences from "./pages/ChoosePreferences";
import Login from "./pages/Login";
import { createContext, useEffect, useMemo, useReducer } from "react";
import EditActivity from "./pages/EditActivity";
import Participants from "./pages/Participants";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { backendUrl } from "./scripts/backendConnection";

const OverviewStack = createStackNavigator();

function OverviewStackScreen() {
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
      <OverviewStack.Screen name="ActivityStack" component={ActivityStackScreen} options={{ headerShown: false }} />
      <OverviewStack.Screen name="CreateActivity" component={CreateActivity} options={{ headerShown: false }} />
    </OverviewStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen name="ActivityStack" component={ActivityStackScreen} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <ProfileStack.Screen name="ActivityStack" component={Activity} options={{ headerShown: false }} />
      <ProfileStack.Screen name="CreateActivity" component={CreateActivity} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

const ActivityStack = createStackNavigator();
function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen name="Activity" component={Activity} options={{ headerShown: false }} />
      <ActivityStack.Screen name="EditActivity" component={EditActivity} options={{ headerShown: false }} />
      <ActivityStack.Screen name="Participants" component={Participants} options={{ headerShown: false }} />
    </ActivityStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function loggedInStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="OverviewStack" component={OverviewStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="SearchStack" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const LoggedOutStack = createStackNavigator();

function loggedOutStack() {
  return (
    <LoggedOutStack.Navigator>
      <LoggedOutStack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="ChoosePreferences" component={ChoosePreferences} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
    </LoggedOutStack.Navigator>
  );
}

interface AuthType {
  signIn: Function;
  signOut: Function;
  signUp: Function;
}

export const AuthContext: React.Context<AuthType> = createContext({} as AuthType);

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type?: any; token?: string; id?: string }) => {
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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userId;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await getItemAsync("userToken");
        userId = await getItemAsync("userId");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_DATA", token: userToken as string, id: userId as string });
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthType = useMemo(
    () => ({
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
      signOut: () => dispatch({ type: "SIGN_OUT" }),
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
