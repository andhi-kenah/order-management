import type {StackNavigationProp} from '@react-navigation/stack';

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

import useTheme from '../../services/Theme';
import {DarkColor, LightColor} from '../../colors/Colors';
import Header from '../../components/Header';
import EmptyList from '../../components/EmptyList';
import FloatingButton from '../../components/FloatingButton';

type OrderStackParamList = {
  Customer: undefined;
  CustomerDetail: {customer: string};
  NewOrder: undefined;
};
type NavigationProps = StackNavigationProp<OrderStackParamList, 'CustomerDetail'>;

type Prop = {
  navigation: NavigationProps;
};

const Customers: React.FC<Prop> = ({navigation}) => {
  const isDark = useTheme();

  const [items, setItems] = useState<string[]>();
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string[] | null>();
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection('orders')
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        query => {
          const data: string[] = [];

          query.forEach((doc: any) => {
            const customer = doc.data().customer;

            if (!data.includes(customer)) {
              data.push(customer);
            }
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
        return value.toLowerCase().includes(text.toLowerCase());
      }),
    );
    setIsLoading(false);
  };

  const RenderItem = ({data}: {data: string}) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: isDark ? DarkColor.ComponentColor : LightColor.Background,
          borderRadius: 8,
          marginVertical: 6,
          marginHorizontal: 18,
          elevation: 4
        }}
        onPress={() => navigation.navigate('CustomerDetail', {customer: data})}>
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: '100%',
              width: 70,
              justifyContent: 'center',
            }}>
            <Icon
              name={'person-circle-sharp'}
              size={44}
              color={isDark ? DarkColor.Secondary : LightColor.Secondary}
              style={{textAlign: 'center'}}
            />
          </View>
          <View style={{flex: 1, paddingRight: 10, paddingVertical: 20}}>
            <Text
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                fontSize: 16,
                fontFamily: 'sans-serif-medium',
              }}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {data}
            </Text>
          </View>
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
        title={'Clients'}
        searchTitle={'Rechercher un produit'}
        searchValue={search}
        onPressSearchButton={() => {
          setSearchMode(false);
          setSearch('');
        }}
        onChangeText={handleSearch}
        hasFilter={false}
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
            renderItem={({item}: {item: string}) => (
              <RenderItem data={item} />
            )}
            keyExtractor={(_, index) => index.toString()}
            style={{marginTop: 4}}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'on-drag'}
            ListHeaderComponentStyle={{marginBottom: 10}}
            ListFooterComponent={<View style={{height: 80}} />}
            ListEmptyComponent={
              <EmptyList searchMode={searchMode} searchValue={search} />
            }
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

export default Customers;
