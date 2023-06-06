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
import { LogBox } from "react-native";
import { useEffect, useState } from "react";
import EditActivity from "./pages/EditActivity";
import Participants from "./pages/Participants";
import Loading from "./components/Loading";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const OverviewStack = createStackNavigator();

function OverviewStackScreen() {
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
      <OverviewStack.Screen name="Activity" component={ActivityStackScreen} options={{ headerShown: false }} />
      <OverviewStack.Screen name="CreateActivity" component={CreateActivity} options={{ headerShown: false }} />
    </OverviewStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen name="Activity" component={ActivityStackScreen} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen(setUserToken: any) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} initialParams={setUserToken} />
      <ProfileStack.Screen name="Activity" component={Activity} options={{ headerShown: false }} />
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

function loggedInStack(setUserToken: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Overview" component={OverviewStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen(setUserToken)} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const LoggedOutStack = createStackNavigator();

function loggedOutStack(setUserToken: any) {
  return (
    <LoggedOutStack.Navigator>
      <LoggedOutStack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="ChoosePreferences" component={ChoosePreferences} options={{ headerShown: false }} />
      <LoggedOutStack.Screen name="Login" component={Login} options={{ headerShown: false }} initialParams={{ setUserToken }} />
      <LoggedOutStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
    </LoggedOutStack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const getUserToken = async () => {
    // testing purposes
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      // custom logic
      await sleep(100);
      const token = null;
      setUserToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <Loading />;
  }

  return <NavigationContainer>{userToken ? loggedInStack(setUserToken) : loggedOutStack(setUserToken)}</NavigationContainer>;
}
