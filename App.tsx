import type { DataType } from 'Data';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { DarkColor, LightColor } from 'colors/Colors';

import Customers from 'screens/Customers/Customers';
import Orders from 'screens/Orders/Orders';
import OrderDetail from 'screens/Orders/OrderDetail';
import CustomerDetail from 'screens/Customers/CustomerDetail';
import NewOrder from 'screens/Orders/NewOrder';
import useTheme from 'services/Theme';

type RootTabParamList = {
  Orders: { item: DataType[] };
  Customers: undefined;
};

type RootStackParamList = {
  Home: undefined;
  OrderDetail: { item: DataType };
  CustomerDetail: { customer: string };
  NewOrder: { item: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeTabs = () => {
  const isDark = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={'Orders'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDark ? DarkColor.Primary : LightColor.Primary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 50,
          backgroundColor: isDark
            ? DarkColor.Background
            : LightColor.Background,
        },
        tabBarLabel: route.name === 'Orders' ? 'Commandes' : 'Clients',
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'normal', margin: 4 },
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Orders') {
            iconName = focused ? 'layers-sharp' : 'layers-outline';
          } else if (route.name === 'Customers') {
            iconName = focused ? 'people-sharp' : 'people-outline';
          }
          return (
            <Icon
              name={iconName}
              size={32}
              color={color}
              style={{ marginBottom: -12 }}
            />
          );
        },
      })}>
      <Tab.Screen name={'Orders'} component={Orders} />
      <Tab.Screen name={'Customers'} component={Customers} />
    </Tab.Navigator>
  );
};

const App = () => {
  const isDark = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />
        <NavigationContainer
          fallback={
            <ActivityIndicator
              size={'large'}
              color={isDark ? DarkColor.Primary : LightColor.Primary}
            />
          }>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                elevation: 1,
                backgroundColor: isDark
                  ? DarkColor.Background
                  : LightColor.Background,
              },
              headerBackImage: () => (
                <View
                  style={{
                    backgroundColor: isDark
                      ? DarkColor.Background
                      : LightColor.Background,
                    height: 34,
                    width: 34,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 4,
                  }}>
                  <Icon
                    name={'chevron-back'}
                    color={
                      isDark
                        ? DarkColor.Text
                        : LightColor.Text
                    }
                    size={22}
                    style={{ marginRight: 2 }}
                  />
                </View>
              ),
              headerPressColor: '#2222',
            }}>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderDetail"
              component={OrderDetail}
              options={{ headerTitle: '', headerTransparent: true }}
            />
            <Stack.Screen
              name="CustomerDetail"
              component={CustomerDetail}
              options={{ headerTitle: '', headerTransparent: true }}
            />
            <Stack.Screen
              name="NewOrder"
              component={NewOrder}
              options={{
                presentation: 'card',
                headerShown: false,
                cardOverlay: () => (
                  <View
                    style={{ backgroundColor: isDark ? '#333' : '#ccc', flex: 1 }}
                  />
                ),
                cardStyle: {
                  borderRadius: 10,
                  marginTop: StatusBar.currentHeight
                    ? StatusBar.currentHeight + 14
                    : 14,
                  marginBottom: 14,
                  marginHorizontal: 14,
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
