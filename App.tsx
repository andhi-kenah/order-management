import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Orders from './src/screens/Orders';
import Customers from './src/screens/Customers';
import {DarkColor, LightColor} from 'colors/Colors';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
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
        <Tab.Navigator
          initialRouteName={'Orders'}
          screenOptions={({route, navigation}) => ({
            headerShown: false,
            tabBarActiveTintColor: isDark
              ? DarkColor.Primary
              : LightColor.Primary,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: 50,
              backgroundColor: isDark
                ? DarkColor.Background
                : LightColor.Background,
            },
            tabBarLabel: route.name === 'Orders' ? 'Commandes' : 'Clients',
            tabBarLabelStyle: {fontSize: 13, fontWeight: 'bold', margin: 4},
            tabBarLabelPosition: 'below-icon',
            tabBarIcon: ({focused, color, size}) => {
              let iconName = 'home';
              if (route.name === 'Orders') {
                iconName = focused ? 'layers-sharp' : 'layers-outline';
              } else if (route.name === 'Customers') {
                iconName = focused ? 'people-sharp' : 'people-outline';
              }
              return <Icon name={iconName} size={size} color={color} style={{marginBottom: -12}} />;
            },
          })}>
          <Tab.Screen name={'Orders'} component={Orders} />
          <Tab.Screen name={'Customers'} component={Customers} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
