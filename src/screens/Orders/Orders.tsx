import type {StackNavigationProp} from '@react-navigation/stack';
import type {DataType} from '../../services/Data';

import React, {useState} from 'react';
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {DarkColor, LightColor} from '../../colors/Colors';

import Header from '../../components/Header';
import SearchInput from '../../components/SearchInput';
import FloatingButton from 'components/FloatingButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {getDeliveryDate} from 'services/Functions';

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: {item: DataType};
  NewOrder: undefined;
};
type NavigationProps = StackNavigationProp<OrderStackParamList, 'OrderList'>;

type Prop = {
  navigation: NavigationProps;
};

const OrderList: React.FC<Prop> = ({navigation}) => {
  const isDark = useColorScheme() === 'dark';

  const [items, setItems] = useState<DataType[] | undefined>();
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<DataType[] | undefined>();
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const data: DataType[] = [];

          querySnapshot.forEach((documentSnapshot: any) => {
            data.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setItems(data);
          setIsLoading(false);
        },
        err => {
          console.log(err);
        },
      );

    return () => subscriber();
  }, []);

  const handleSearch = (text: string) => {
    if (!text && text.length === 0) {
      setSearch('');
      setSearchMode(false);
    } else {
      setSearchMode(true);
    }

    setIsLoading(true);
    setSearch(text);
    setSearchResult(
      items?.filter(value => {
        return value.name.toLowerCase().includes(text.toLowerCase());
      }),
    );
    setIsLoading(false);
  };

  const EmptyList = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: search ? 'flex-start' : 'center',
          padding: search ? 10 : 20,
        }}>
        {searchMode ? (
          <View>
            <Text
              style={{
                color: isDark ? DarkColor.Secondary : LightColor.Secondary,
                textAlign: 'center',
              }}>
              Il n'y a pas de "{search}" dans la liste de commande
            </Text>
          </View>
        ) : (
          <>
            <Icon
              name={'apps'}
              color={isDark ? DarkColor.Secondary : LightColor.Secondary}
              size={70}
            />
            <Text
              style={{
                fontSize: 16,
                color: isDark ? DarkColor.Secondary : LightColor.Secondary,
                textAlign: 'center',
                marginTop: 30,
              }}>
              Cliquer sur le bouton <Icon name={'add-circle'} size={20} /> pour
              ajouter un commande
            </Text>
          </>
        )}
      </View>
    );
  };

  const RenderItem = ({data}: {data: DataType}) => {
    const getDone = (): number => {
      if (data.done) {
        let done = 0;
        for (let n of data.done) {
          done += n.number;
        }
        return done;
      }
      return 0;
    };

    const getTotal = () => {
      if (data.quantity) {
        let total = 0;
        for (const n of data.quantity) {
          total += parseInt(n.number.toString());
        }
        return total;
      }
      return 0;
    };

    const setBackgroundColor = (): string => {
      if (getDone() === getTotal()) {
        return '#ebffeb';
      } else {
        return isDark ? DarkColor.Secondary : LightColor.Background;
      }
    };

    return (
      <TouchableOpacity
        style={{
          backgroundColor: setBackgroundColor(),
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 8,
          marginVertical: 6,
          marginHorizontal: 18,
          overflow: 'hidden',
          elevation: 2,
        }}
        onPress={() => navigation.navigate('OrderDetail', {item: data})}>
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: '100%',
              width: 60,
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
            }}></View>
          <View style={{flex: 1, padding: 10}}>
            <Text
              style={{fontSize: 15, fontWeight: 'bold'}}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {data.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? DarkColor.Text : LightColor.Text,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {data.customer}
              <Text style={{color: 'lightgrey'}}>
                {' - '}
                {getDeliveryDate(data.delivery)}
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color:
                getDone() == getTotal()
                  ? 'green'
                  : isDark
                  ? DarkColor.Primary
                  : LightColor.Primary,
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              borderRadius: 4,
              padding: 8,
            }}>
            {getDone()}/{getTotal()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <Header
        title={'Commandes'}
        searchTitle={'Rechercher un produit'}
        searchValue={search}
        onPressSearchButton={() => {setSearchMode(false); setSearch('')}}
        onChangeText={handleSearch}
      />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark
              ? DarkColor.Background
              : LightColor.Background,
          }}>
          <ActivityIndicator
            size={'large'}
            color={isDark ? DarkColor.Primary : LightColor.Primary}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={searchMode ? searchResult : items}
            renderItem={({item}: {item: DataType}) => (
              <RenderItem data={item} key={item.key} />
            )}
            keyExtractor={item => item.key}
            style={{marginTop: 4}}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'on-drag'}
            ListHeaderComponentStyle={{marginBottom: 10}}
            ListFooterComponent={<View style={{height: 80}} />}
            ListEmptyComponent={<EmptyList />}
          />
          <FloatingButton
            icon={'add'}
            backgroundColor={isDark ? DarkColor.Primary : LightColor.Primary}
            onPress={() => navigation.navigate('NewOrder')}
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default OrderList;
