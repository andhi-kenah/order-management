import React from 'react';
import {StatusBar, View, useColorScheme} from 'react-native';
import {DarkColor, LightColor} from 'colors/Colors';

import Header from '../components/Header';
import SearchInput from 'components/SearchInput';

const Customers: React.FC = () => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Header title={'Clients'} />
      <SearchInput title={'Rechercher un client'} />
    </View>
  )
}

export default Customers;