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
import {ContextProvider} from 'services/Context';
import {DarkColor, LightColor} from 'colors/Colors';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ContextProvider>
        <NavigationContainer
          fallback={
            <ActivityIndicator
              size={'large'}
              color={isDark ? DarkColor.Primary : LightColor.Primary}
            />
          }>
          <Tab.Navigator
            initialRouteName={'Orders'}
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: isDark
                ? DarkColor.Primary
                : LightColor.Primary,
              tabBarHideOnKeyboard: true,
              tabBarStyle: {
                backgroundColor: isDark
                  ? DarkColor.Background
                  : LightColor.Background,
              },
            }}>
            <Tab.Screen
              name={'Orders'}
              component={Orders}
              options={{
                tabBarLabel: 'Commandes',
                tabBarIcon: ({color, size, focused}) => (
                  <View
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: focused ? color : 'transparent',
                    }}>
                    <Icon name="layers" color={color} size={size} />
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name={'Customers'}
              component={Customers}
              options={{
                tabBarLabel: 'Clients',
                tabBarIcon: ({color, size, focused}) => (
                  <View
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: focused ? color : 'transparent',
                    }}>
                    <Icon name="people" color={color} size={size} />
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}

export default App;
