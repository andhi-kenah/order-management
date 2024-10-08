import React, { useState } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform, 
  UIManager, 
  LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../services/Theme';
import { DarkColor, LightColor } from '../colors/Colors';
import SearchInput from './SearchInput';

type Props = {
  title: string;
  onPressSearchButton: () => void;
  searchTitle: string;
  searchValue: string;
  onChangeText: (text: string) => void;
  hasFilter: boolean;
  filter?: string; // filter is optional
  onFilter?: () => void;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Header: React.FC<Props> = ({ title, onPressSearchButton, searchTitle, searchValue, onChangeText, hasFilter }: Props) => {
  const isDark = useTheme();

  const [searchActive, setSearchActive] = useState<boolean>(false);

  return (
    <View
      style={{
        backgroundColor: isDark ? DarkColor.Primary : LightColor.Primary,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
        paddingBottom: 12,
        paddingHorizontal: 18,
        marginBottom: 0,
        elevation: 4
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: DarkColor.Text }} numberOfLines={1}>
        {title}
      </Text>
      <View
        style={{
          position: 'absolute',
          top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
          right: 18,
        }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {
            hasFilter &&
            <TouchableOpacity
              style={{
                backgroundColor: isDark
                  ? DarkColor.Background
                  : LightColor.Background,
                height: 34,
                width: 34,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4
              }}>
              <Icon
                name={'funnel'}
                color={isDark ? DarkColor.Text : LightColor.Text}
                size={18}
                style={{ marginTop: 4 }}
              />
            </TouchableOpacity>
          }

          <TouchableOpacity
            style={{
              backgroundColor:
                searchActive
                  ? isDark ? DarkColor.Secondary : LightColor.Secondary
                  : isDark
                    ? DarkColor.Background
                    : LightColor.Background,
              height: 34,
              width: 34,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 4
            }}
            onPress={() => { setSearchActive(!searchActive); LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); onPressSearchButton() }}>
            <Icon
              name={'search'}
              color={isDark ? DarkColor.Text : LightColor.Text}
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>

      {
        searchActive &&
        <View style={{ marginTop: 14 }}>
          <SearchInput title={searchTitle} value={searchValue} onChangeText={onChangeText} />
        </View>
      }
      
    </View>
  );
};

export default Header;
