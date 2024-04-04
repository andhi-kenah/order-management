import {DarkColor, LightColor} from 'colors/Colors';
import React from 'react';
import {
  View,
  Text,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  deleteActive?: boolean;
  onDelete?: () => void;
};

const Header: React.FC<Props> = ({title, deleteActive, onDelete}: Props) => {
  const isDark = useColorScheme() === 'dark';
  return (
    <View
      style={{
        paddingBottom: 14,
        paddingTop: 14,
      }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
          textAlign: 'center',
        }}>
        {title}
      </Text>
      <View style={{position: 'absolute', top: 10, right: 10, padding: 20}}>
        {
          deleteActive && 
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 32,
              paddingRight: 10,
              zIndex: 100,
            }}
            onPress={onDelete}>
            <Icon
              name={'trash'}
              color={isDark ? DarkColor.Text : LightColor.Text}
              size={24}
            />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

export default Header;
