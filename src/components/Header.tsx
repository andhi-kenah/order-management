import React, {useState} from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../services/Theme';
import {DarkColor, LightColor} from '../colors/Colors';
import SearchInput from './SearchInput';

type Props = {
  title: string;
  onPressSearchButton: () => void;
  searchTitle: string;
  searchValue: string;
  onChangeText: (text: string) => void;
  hasFilter: boolean;
  filter?: string;
  onFilter?: () => void;
};

const Header: React.FC<Props> = ({title, onPressSearchButton, searchTitle, searchValue, onChangeText, hasFilter}: Props) => {
  const isDark = useTheme();

  const [searchActive, setSearchActive] = useState<boolean>(false);

  return (
    <View
      style={{
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
        paddingBottom: 4,
        marginHorizontal: 18,
        marginBottom: 4
      }}>
      <Text style={{fontSize: 22, fontWeight: 'bold', color: isDark ? DarkColor.Text : LightColor.Text}} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={{
          position: 'absolute',
          top: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
          right: 0,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {
            hasFilter &&
            <TouchableOpacity
              style={{
                backgroundColor: isDark
                  ? DarkColor.ComponentColor
                  : LightColor.ComponentColor,
                height: 38,
                width: 38,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Icon
                name={'funnel'}
                color={
                  isDark ? DarkColor.Text : LightColor.Text
                }
                size={18}
                style={{marginTop: 4}}
              />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={{
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              height: 38,
              width: 38,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {onPressSearchButton(); setSearchActive(!searchActive)}}>
            <Icon
              name={'search'}
              color={
                isDark ? DarkColor.Text : LightColor.Text
              }
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
      {
        searchActive &&
        <View style={{marginTop: 20}}>
          <SearchInput title={searchTitle} value={searchValue} onChangeText={onChangeText} />
        </View>
      }
    </View>
  );
};

export default Header;
