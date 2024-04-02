import React from 'react';
import {View, TextInput, TouchableOpacity, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';
import {Props} from './Props';

const SearchInput: React.FC<Props> = ({title}: Props) => {
  const isDark = useColorScheme() === 'dark';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 4
      }}>
      <View style={{flex: 1}}>
        <TextInput
          placeholder={title}
          style={{
            backgroundColor: isDark ? DarkColor.ComponentColor : LightColor.ComponentColor,
            fontSize: 16,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginRight: 4,
          }}
        />
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: isDark
              ? DarkColor.Text
              : LightColor.Text,
            borderRadius: 50,
            padding: 8,
          }}>
          <Icon name="search" size={18} color={LightColor.Background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchInput;
