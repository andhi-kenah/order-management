import type {StackNavigationProp} from '@react-navigation/stack';
import type {DataType} from '../../services/Data';

import React, {useState} from 'react';
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useData} from '../../services/Data';
import {DarkColor, LightColor} from '../../colors/Colors';

import Header from '../../components/Header';
import SearchInput from '../../components/SearchInput';
import FloatingButton from 'components/FloatingButton';

type RootStackParamList = {
  OrderList: undefined;
  OrderDetail: {item: DataType};
  NewOrder: undefined
};
type NavigationProps = StackNavigationProp<RootStackParamList, 'OrderList'>;

type Prop = {
  navigation: NavigationProps;
};

const OrderList: React.FC<Prop> = ({navigation}) => {
  const isDark = useColorScheme() === 'dark';

  let {items} = useData();

  const [isModalNewItem, setModalNewItem] = useState<boolean>(false);
  
  let information: DataType = {
    id: '',
    name: '',
    customer: '',
    delivery: '26/02/2024',
    quantity: [{number: 0, description: ''}],
    done: [{number: 0, description: ''}],
    hasImage: false,
    price: 0,
    description: '',
  }
  
  const [form, setForm] = useState<DataType>(information);

  // React.useEffect(() => {}, [form])
  const effect = async () => {
    const userDocument = (await firestore().collection('item').doc('cEGlookcwDwPQ9EaQUaC').get()).data()
    console.log(userDocument);
  }
  React.useEffect(() => {
    effect();
  }, [])

  const RenderItem = ({data}: {data: DataType}) => {
    const getDelivery = () => {
        if (data.delivery) {
            const months = ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sept', 'Oct', 'Nov', 'Dec'];
            const date = new Date(data.delivery.replaceAll('/', '-'));
            return date.getDate().toString() + ' ' + months[date.getMonth()];
        }
        return '';
    }

    const getDone = () => {
        if (data.quantity) {
            let done = 0;
            for (const n of data.done) {
                done += n.number;
            }
            return  done;
        }
        return 0;
    }

    const getTotal = () => {
        if (data.quantity) {
            let total = 0;
            for (const n of data.quantity) {
                total += n.number;
            }
            return  total;
        }
        return 0;
    }

    return (
      <TouchableOpacity
        style={{
          backgroundColor: isDark ? DarkColor.Secondary : LightColor.Background,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 8,
          marginVertical: 6,
          marginHorizontal: 20,
          overflow: 'hidden',
          elevation: 2,
        }}
        onPress={() => navigation.navigate('OrderDetail', {item: data})}>
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 60,
              width: 60,
              backgroundColor: isDark
                ? DarkColor.Secondary
                : LightColor.Secondary,
            }}></View>
          <View style={{flex: 1, padding: 10}}>
            <Text
              style={{fontSize: 14, fontWeight: 'bold'}}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={{fontSize: 13, color: isDark ? DarkColor.Text : LightColor.Text}} ellipsizeMode="tail" numberOfLines={1}>
              {data.customer}<Text style={{color: 'lightgrey'}}>{' - '}{getDelivery()}</Text>
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
              color: isDark ? DarkColor.Primary : LightColor.Primary,
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
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <Header title={'Commandes'} />
      
      <FlatList
        data={items}
        renderItem={({item}: {item: DataType}) => <RenderItem data={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<SearchInput title={'Rechercher un produit'} />}
        ListHeaderComponentStyle={{marginBottom: 10}}
        ListFooterComponent={<View style={{height: 80}}/>}
      />
      <FloatingButton backgroundColor={isDark ? DarkColor.Primary : LightColor.Primary} onPress={() => navigation.navigate('NewOrder')} />
    </View>
  );
};

export default OrderList;
