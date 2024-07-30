import type { DataType } from 'Type';
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
import useTheme from 'services/Theme';

import Customers from 'screens/Customers/Customers';
import Orders from 'screens/Orders/Orders';
import OrderDetail from 'screens/Orders/OrderDetail';
import CustomerDetail from 'screens/Customers/CustomerDetail';
import NewOrder from 'screens/Orders/NewOrder';


type RootTabParamList = {
  Orders: { item: DataType[] };
  Customers: undefined;
};

type RootStackParamList = {
  Home: undefined;
  OrderDetail: { item: DataType };
  OrderImage: { image: string | undefined };
  CustomerDetail: { customer: string };
  NewOrder: { item: string };
};


const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();


// Main page: Bottom tab
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
          height: 56,
          backgroundColor: isDark
            ? DarkColor.Background
            : LightColor.Background,
          borderColor: '#6662'
        },
        tabBarLabel: route.name === 'Orders' ? 'Commandes' : 'Clients',
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', margin: 2 },
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
              size={30}
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
        // barStyle={isDark ? 'light-content' : 'dark-content'}
        barStyle={'light-content'}
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
                  name={'arrow-back'}
                  color={
                    isDark
                      ? DarkColor.Text
                      : LightColor.Text
                  }
                  size={20}
                  style={{ marginLeft: 0 }}
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
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
