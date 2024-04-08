import React, { useState } from 'react';
import {StatusBar, View, useColorScheme} from 'react-native';
import {DarkColor, LightColor} from 'colors/Colors';

import Header from '../../components/Header';

const Customers: React.FC = () => {
  const isDark = useColorScheme() === 'dark';

  const [search, setSearch] = useState<string>('');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Header title={'Clients'} onPressSearchButton={() => {}} searchTitle={'Rechercher un client'} searchValue={search} onChangeText={(text) => setSearch(text)} />
    </View>
  )
}

export default Customers;