import { Text, View, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DarkColor, LightColor } from 'colors/Colors';

type Props = {
  searchMode: boolean;
  searchValue: string;
}

const EmptyList = ({ searchMode, searchValue }: Props) => {
  const isDark = useColorScheme() === 'dark';
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
            Il n'y a pas de "{searchValue}" dans la liste de commande
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
