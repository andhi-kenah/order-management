import React from 'react';
import {View, TextInput, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../services/Theme';
import {DarkColor, LightColor} from 'colors/Colors';

type Props = {
  title: string;
  value: string;
  onChangeText: (text: string) => void;
};

const SearchInput: React.FC<Props> = ({
  title,
  value,
  onChangeText
}: Props) => {
  const isDark = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark
            ? DarkColor.ComponentColor
            : LightColor.ComponentColor,
          borderRadius: 10,
          paddingHorizontal: 8,
        }}>
        <Icon
          name={'search'}
          size={20}
          color={'grey'}
          style={{marginHorizontal: 6}}
        />
        <TextInput
          placeholder={title}
          placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
          inputMode="search"
          value={value}
          onChangeText={onChangeText}
          underlineColorAndroid={'transparent'}
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 10,
            paddingLeft: 8,
          }}
        />
      </View>
    </View>
  );
};

export default SearchInput;
