import { Text, View, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DarkColor, LightColor } from 'colors/Colors';
import useTheme from '../services/Theme';

type Props = {
  searchMode: boolean;
  searchValue: string;
}

const EmptyList = ({ searchMode, searchValue }: Props) => {
  const isDark = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: searchValue ? 'flex-start' : 'center',
        padding: searchValue ? 10 : 20,
      }}>
      {searchMode ? (
        <View>
          <Text
            style={{
              color: isDark ? DarkColor.Secondary : LightColor.Secondary,
              textAlign: 'center',
            }}>
            {searchValue}
          </Text>
        </View>
      ) : (
        <>
          <Icon
            name={'apps'}
            color={isDark ? DarkColor.Secondary : LightColor.Secondary}
            size={100}
          />
          <Text
            style={{
              fontSize: 16,
              color: isDark ? DarkColor.Secondary : LightColor.Secondary,
              textAlign: 'center',
              marginTop: 30,
            }}>
            Cliquer sur le bouton <Icon name={'add-circle'} size={30} /> pour
            ajouter un commande
          </Text>
        </>
      )}
    </View>
  );
};

export default EmptyList;
