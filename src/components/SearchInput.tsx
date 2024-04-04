import React from 'react';
import {View, TextInput, TouchableOpacity, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';

type Props = {
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
};

const SearchInput: React.FC<Props> = ({
  title,
  value,
  onChangeText,
  onSubmit,
}: Props) => {
  const isDark = useColorScheme() === 'dark';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 4,
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
        <TextInput
          placeholder={title}
          inputMode="search"
          value={value}
          onChangeText={onChangeText}
          underlineColorAndroid={'transparent'}
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 10,
            paddingLeft: 8
          }}
        />
        <Icon
          name={'search'}
          size={20}
          color={'grey'}
          style={{marginHorizontal: 6}}
        />
      </View>
      <TouchableOpacity style={{padding: 8, marginRight: -8}}>
        <Icon name={'funnel'} color={isDark ? DarkColor.Text : LightColor.Text} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
