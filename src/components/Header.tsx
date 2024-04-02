import React from 'react';
import {View, Text, useColorScheme, StatusBar} from 'react-native';
import {Props} from './Props';

const Header: React.FC<Props> = ({title}: Props) => {
  const dark = useColorScheme() === 'dark';
  return (
    <View
      style={{
        paddingBottom: 14,
        paddingTop: StatusBar.currentHeight? StatusBar.currentHeight + 14 : 14,
        marginBottom: 6,
      }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: dark ? 'white' : 'black',
          textAlign: 'center'
        }}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
