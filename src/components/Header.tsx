import React, {useState} from 'react';
import {
  View,
  Text,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';
import SearchInput from './SearchInput';

type Props = {
  title: string;
  onPressSearchButton: () => void;
  searchTitle: string;
  searchValue: string;
  onChangeText: (text: string) => void;
  filter?: string;
  onFilter?: () => void;
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Anim = () => {
  LayoutAnimation.configureNext({
    duration: 500,
    create: {
      duration: 200,
      property: 'scaleXY',
      type: 'spring',
      springDamping: 1.4,
    },
    update: {
      property: 'scaleXY',
      type: 'spring',
      springDamping: 1.4
    },
    delete: {
      duration: 200,
      property: 'scaleY',
      type: 'spring',
      springDamping: 1.4
    }
  })
}

const Header: React.FC<Props> = ({title, onPressSearchButton, searchTitle, searchValue, onChangeText}: Props) => {
  const isDark = useColorScheme() === 'dark';

  const [searchActive, setSearchActive] = useState<boolean>(false);

  return (
    <View
      style={{
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
        paddingBottom: 4,
        marginHorizontal: 18,
        marginBottom: 4
      }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
        }}>
        {title}
      </Text>
      <View
        style={{
          position: 'absolute',
          top: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
          right: 0,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            style={{
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              height: 34,
              width: 34,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Icon
              name={'funnel'}
              color={
                useColorScheme() === 'dark' ? DarkColor.Text : LightColor.Text
              }
              size={18}
              style={{marginTop: 4}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              height: 34,
              width: 34,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {onPressSearchButton(); setSearchActive(!searchActive)}}>
            <Icon
              name={'search'}
              color={
                useColorScheme() === 'dark' ? DarkColor.Text : LightColor.Text
              }
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
      {
        searchActive &&
        <View style={{marginTop: 10}}>
          <SearchInput title={searchTitle} value={searchValue} onChangeText={onChangeText} />
        </View>
      }
    </View>
  );
};

export default Header;
