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
import { TouchableOpacity, View, Text } from "react-native";
import { Icon } from "@react-native-material/core";
import { appColors } from "./styles/StyleAttributes";
import { TabBarStyles } from "./styles/TabBarStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "./pages/Settings";

const OverviewStack = createStackNavigator();

const ActivityStack = createStackNavigator();
export function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator screenOptions={{ cardStyle: { backgroundColor: appColors.background } }}>
      <ActivityStack.Screen
        name="Activity"
        component={Activity}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
      <ActivityStack.Screen
        name="EditActivity"
        component={EditActivity}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
      <ActivityStack.Screen
        name="CreateActivity"
        component={CreateActivity}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
      <ActivityStack.Screen
        name="Participants"
        component={Participants}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </ActivityStack.Navigator>
  );
}

export function OverviewStackScreen() {
  return (
    <OverviewStack.Navigator screenOptions={{ cardStyle: { backgroundColor: appColors.background } }}>
      <OverviewStack.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
      <OverviewStack.Screen
        name="ActivityStack"
        component={ActivityStackScreen}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </OverviewStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

export function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ cardStyle: { backgroundColor: appColors.background } }}>
      <SearchStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen
        name="ActivityStack"
        component={ActivityStackScreen}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </SearchStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ cardStyle: { backgroundColor: appColors.background } }}>
      <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <ProfileStack.Screen
        name="ActivityStack"
        component={ActivityStackScreen}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
      />
    </ProfileStack.Navigator>
  );
}

const LoggedOutStack = createStackNavigator();

export function loggedOutStack() {
  return (
    <LoggedOutStack.Navigator screenOptions={{ cardStyle: { backgroundColor: appColors.background } }}>
      <LoggedOutStack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
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

const Tab = createBottomTabNavigator();

export function loggedInStack() {
  return (
    <Tab.Navigator tabBar={(props) => <OaaTabBar {...props} />}>
      <Tab.Screen name="OverviewStack" component={OverviewStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="SearchStack" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// @ts-ignore
function OaaTabBar({ state, descriptors, navigation }) {
  const tabAttributes = [
    {
      tabName: "OverviewStack",
      label: "Übersicht",
      icon: "home",
    },
    {
      tabName: "SearchStack",
      label: "Suche",
      icon: "magnify",
    },
    {
      tabName: "ProfileStack",
      label: "Profil",
      icon: "account",
    },
  ];

  const insets = useSafeAreaInsets();

  return (
    <View style={[TabBarStyles.bar, { marginBottom: insets.bottom }]}>
      {state.routes.map((route: { key: string | number; name: any }, index: any) => {
        const { options } = descriptors[route.key];
        let label = route.name;
        let icon = "home";

        for (const tab of tabAttributes) {
          if (tab.tabName === route.name) {
            label = tab.label;
            icon = tab.icon;
          }
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            activeOpacity={0.8}
            onPress={onPress}
            onLongPress={onLongPress}
            style={TabBarStyles.tab}>
            <Icon name={icon} size={24} color={isFocused ? appColors.buttonPrimary : appColors.body} />
            <Text style={[TabBarStyles.label, { color: isFocused ? appColors.buttonPrimary : appColors.body }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
