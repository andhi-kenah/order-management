import type { StackNavigationProp } from '@react-navigation/stack';
import type { DataType } from '../../Type';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

import useTheme from '../../services/Theme';
import { DarkColor, LightColor } from '../../colors/Colors';
import Header from '../../components/Header';
import FloatingButton from 'components/FloatingButton';
import EmptyList from '../../components/EmptyList';
import { getDeliveryDate, getDeliveryLate, getDone, getTotal } from '../../services/Functions';
import moment from 'moment';

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { item: DataType };
  NewOrder: undefined;
};
type NavigationProps = StackNavigationProp<OrderStackParamList, 'OrderList'>;

type Prop = {
  navigation: NavigationProps;
};

const OrderList: React.FC<Prop> = ({ navigation }) => {
  const isDark = useTheme();

  const [items, setItems] = useState<DataType[] | undefined>();
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<DataType[] | undefined>();
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection('orders')
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        querySnapshot => {
          const data: DataType[] = [];

          querySnapshot.forEach((doc: any) => {
            data.push({
              ...doc.data(),
              key: doc.id,
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
        return value.name.toLowerCase().includes(text.toLowerCase()) || value.customer.toLowerCase().includes(text.toLowerCase());
      }),
    );
    setIsLoading(false);
  };

  const RenderItem = ({ data }: { data: DataType }) => {
    const setBackgroundColor = (): string => {

      if (getDone(data.done) === getTotal(data.quantity) || data.isDone) {
        return isDark ? DarkColor.SuccessTwo : LightColor.SuccessTwo;
      } else {
        if (data.delivery) {
          if (getDeliveryLate(data.delivery)) {
            return isDark ? DarkColor.DangerTwo : LightColor.DangerTwo;
          }
        }
        return isDark ? DarkColor.BackgroundTwo : LightColor.Background;
      }
    };

    const setDeliveryTextColor = () => {
      if (data.isDone || getDone(data.done) === getTotal(data.quantity)) {
        return 'lightgrey';
      }
      if (getDeliveryLate(data.delivery)) {
        return isDark ? DarkColor.Danger : LightColor.Danger;
      }
    }

    return (
      <TouchableOpacity
        style={{
          backgroundColor: setBackgroundColor(),
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: 18,
          overflow: 'hidden',
          elevation: 4
        }}
        onPress={() => navigation.navigate('OrderDetail', { item: data })}>
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          {
            data.hasImage && data.image &&
            (
              <Image
                source={{ uri: data.image }}
                style={{
                  height: '100%',
                  width: 70,
                  backgroundColor: isDark
                    ? DarkColor.ComponentColor
                    : LightColor.ComponentColor,
                }} />
            )
          }
          <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12 }}>
            <Text
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                fontSize: 16,
                fontFamily: 'sans-serif-medium'
              }}
              ellipsizeMode={'tail'}
              numberOfLines={2}
            >
              
              {data.name}
              {' '}
              {
                (data.isUrgent) &&
                <Icon
                  name={'alert-circle'}
                  size={12}
                  color={'goldenrod'} />
              }
              {' '}
              {
                (getDone(data.done) === getTotal(data.quantity) || data.isDone) &&
                <Icon
                  name={'checkmark-circle'}
                  size={12}
                  color={isDark ? DarkColor.Success : LightColor.Success} />
              }{'\n'}
            </Text>
            <Text
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                fontFamily: 'sans-serif-light',
              }}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {data.customer}
              <Text
                style={{
                  color: 'grey',
                  fontFamily: 'sans-serif-thin',
                }}
                >
                {' - '}
                <Text style={{
                  color: setDeliveryTextColor(),
                  fontWeight: getDeliveryLate(data.delivery) ? 'bold' : 'normal'
                  }}>
                  {getDeliveryDate(data.delivery)}
                </Text>
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color:
                getDone(data.done) == getTotal(data.quantity)
                  ? isDark ? DarkColor.Success : LightColor.Success
                  : isDark
                    ? DarkColor.Text
                    : LightColor.Text,
              backgroundColor: 
              data.isDone || getDone(data.done) == getTotal(data.quantity)
              ? isDark ? DarkColor.BackgroundTwo : LightColor.Background
              : isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              borderRadius: 4,
              padding: 8,
            }}>
            {getDone(data.done)}/{getTotal(data.quantity)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <Header
        title={'Commandes'}
        searchTitle={'Rechercher un produit'}
        searchValue={search}
        onPressSearchButton={() => {
          setSearchMode(false);
          setSearch('');
        }}
        onChangeText={handleSearch}
        hasFilter={true}
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
            renderItem={({ item }: { item: DataType }) => (
              <RenderItem data={item} key={item.key} />
            )}
            keyExtractor={(item, index) => index.toString()}
            style={{ paddingTop: 10, backgroundColor: isDark ? DarkColor.Background : LightColor.BackgroundTwo }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'on-drag'}
            ListHeaderComponentStyle={{ marginBottom: 10 }}
            ListFooterComponent={<View style={{ height: 80 }} />}
            ListEmptyComponent={<EmptyList searchMode={searchMode} searchValue={'Il n\'y a pas de "' + search + '" dans la liste de commande'} />}
          />
          <FloatingButton
            icon={'add'}
            backgroundColor={isDark ? DarkColor.Primary : LightColor.Primary}
            onPress={() => navigation.navigate('NewOrder')}
          />
        </>
      )}
    </View>
  );
};

export default OrderList;
