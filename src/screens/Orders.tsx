import React from 'react';
import {
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';

import OrderList from './Orders/OrderList';
import OrderDetail from './Orders/OrderDetail';
import NewOrder from './Orders/NewOrder';

const Stack = createStackNavigator();

const Orders = () => {
  const isDark = useColorScheme() === 'dark';
  return (
    <Stack.Navigator
      initialRouteName={'OrdersScreen'}
      screenOptions={{
        headerTitle: '',
        headerTitleAlign: 'center',
        headerTintColor: isDark ? DarkColor.Text : LightColor.Text,
        headerBackImage: () => (
          <View
            style={{
              backgroundColor: isDark ? DarkColor.Primary : LightColor.Primary,
              height: 40,
              width: 40,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name={'chevron-back'}
              color={
                useColorScheme() === 'dark'
                  ? DarkColor.Background
                  : LightColor.Background
              }
              size={26}
              style={{marginRight: 2}}
            />
          </View>
        ),
        headerPressColor: '#2222',
        headerStyle: {
          backgroundColor:
            useColorScheme() === 'dark'
              ? DarkColor.Background
              : LightColor.Background,
          elevation: 0,
        },
      }}
      detachInactiveScreens={false}>
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="NewOrder"
        component={NewOrder}
        options={{
          presentation: 'card',
          cardOverlay: () => (
            <View
              style={{backgroundColor: 'lightgrey', flex: 1, opacity: 0.4}}
            />
          ),
          cardStyle: {
            borderRadius: 10,
            marginTop: 14,
            marginHorizontal: 14,
          },
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Orders;
