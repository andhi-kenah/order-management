import React from 'react';
import {StatusBar, TouchableHighlight, TouchableOpacity, View, useColorScheme} from 'react-native';
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
          <Icon
            name={'chevron-back-circle'}
            color={
              useColorScheme() === 'dark'
                ? DarkColor.Background
                : LightColor.Background
            }
            size={30}
          />
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
            <View style={{backgroundColor: 'grey', flex: 1, opacity: 0.4}} />
          ),
          cardStyle: {
            marginTop: StatusBar.currentHeight
              ? StatusBar.currentHeight + 10
              : 10,
            marginBottom: 4,
            marginHorizontal: 14,
          },
          headerTitle: 'Nouvelle commande',
          headerBackImage: () => (
            <Icon name={'close-circle'} color={'#f00000'} size={30} />
          ),
          headerRight: ({pressColor}) => {
            return (
              <TouchableHighlight style={{borderRadius: 50, padding: 4, marginRight: 6}} underlayColor={pressColor} onPress={() => {}}>
                <Icon name={'checkmark-circle'} size={30} color={'green'} />
              </TouchableHighlight>
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Orders;
