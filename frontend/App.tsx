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
    (prevState: any, action: { type?: any; token?: any }) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthType = useMemo(
    () => ({
      signIn: async () => {
        const token: string = "dummy-auth-token-2";
        await setItemAsync("userToken", token);
        dispatch({ type: "SIGN_IN", token: token });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async () => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
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
