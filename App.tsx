import type {DataType} from 'services/Data';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';

import Customers from './src/screens/Customers';
import Orders from 'screens/Orders/Orders';
import OrderDetail from 'screens/Orders/OrderDetail';
import NewOrder from 'screens/Orders/NewOrder';

type RootTabParamList = {
  Orders: {item: DataType[]};
  Customers: undefined;
};

type RootStackParamList = {
  Home: undefined;
  OrderDetail: {item: DataType};
  NewOrder: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeTabs = () => {
  const isDark = useColorScheme() === 'dark';
  return (
    <Tab.Navigator
      initialRouteName={'Orders'}
      screenOptions={({route, navigation}) => ({
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
        tabBarLabelStyle: {fontWeight: 'bold', margin: 4},
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({focused, color, size}) => {
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
              style={{marginBottom: -12}}
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
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{flex: 1}}>
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
                    useColorScheme() === 'dark'
                      ? DarkColor.Text
                      : LightColor.Text
                  }
                  size={22}
                  style={{marginRight: 4}}
                />
              </View>
            ),
            headerPressColor: '#2222',
          }}>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetail}
            options={{headerTitle: ''}}
          />
          <Stack.Screen
            name="NewOrder"
            component={NewOrder}
            options={{
              presentation: 'card',
              headerShown: false,
              cardOverlay: () => (
                <View
                  style={{backgroundColor: 'lightgrey', flex: 1, opacity: 0.4}}
                />
              ),
              cardStyle: {
                borderRadius: 10,
                marginTop: StatusBar.currentHeight
                  ? StatusBar.currentHeight + 14
                  : 14,
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
