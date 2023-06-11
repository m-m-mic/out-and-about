import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import Overview from "./pages/Overview";
import CreateActivity from "./pages/CreateActivity";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import EditActivity from "./pages/EditActivity";
import Participants from "./pages/Participants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import ChoosePreferences from "./pages/ChoosePreferences";
import Login from "./pages/Login";
import * as React from "react";
import { SafeAreaView } from "react-native";

const OverviewStack = createStackNavigator();

const ActivityStack = createStackNavigator();
export function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen name="Activity" component={Activity} options={{ headerShown: false }} />
      <ActivityStack.Screen name="EditActivity" component={EditActivity} options={{ headerShown: false }} />
      <ActivityStack.Screen name="Participants" component={Participants} options={{ headerShown: false }} />
    </ActivityStack.Navigator>
  );
}

export function OverviewStackScreen() {
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
      <OverviewStack.Screen name="ActivityStack" component={ActivityStackScreen} options={{ headerShown: false }} />
      <OverviewStack.Screen name="CreateActivity" component={CreateActivity} options={{ headerShown: false }} />
    </OverviewStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

export function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen name="ActivityStack" component={ActivityStackScreen} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <ProfileStack.Screen name="ActivityStack" component={ActivityStackScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="CreateActivity" component={CreateActivity} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export function loggedInStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="OverviewStack" component={OverviewStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="SearchStack" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const LoggedOutStack = createStackNavigator();

export function loggedOutStack() {
  return (
    <LoggedOutStack.Navigator>
      <LoggedOutStack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <LoggedOutStack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <LoggedOutStack.Screen
        name="ChoosePreferences"
        component={ChoosePreferences}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <LoggedOutStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
      <LoggedOutStack.Screen
        name="Overview"
        component={Overview}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      />
    </LoggedOutStack.Navigator>
  );
}
