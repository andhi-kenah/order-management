import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {DataType} from 'services/Data';

import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {DarkColor, LightColor} from 'colors/Colors';

type RootStackParamList = {
  OrderList: {item: DataType};
  OrderDetail: {item: DataType};
};
type Props = {
  route: RouteProp<RootStackParamList, 'OrderDetail'>;
};
type quantity = {
  number: number;
  description: string;
};

const OrderDetail: React.FC<Props> = ({route}) => {
  const isDark = useColorScheme() === 'dark';
  const {item} = route.params;

  const [isEdit, setEdit] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const ItemNumber = ({quantity, done}: {quantity: quantity; done: number}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 6,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              borderRadius: 4,
              padding: 6,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: isDark ? DarkColor.Text : LightColor.Text,
                verticalAlign: 'middle',
                marginHorizontal: 4,
              }}>
              {done}
            </Text>
            <Text
              style={{
                fontSize: 22,
                color: isDark ? DarkColor.Text : LightColor.Text,
              }}>
              /
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: isDark ? DarkColor.Text : LightColor.Text,
                verticalAlign: 'middle',
                marginHorizontal: 4,
              }}>
              {quantity.number}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: isDark ? DarkColor.Text : LightColor.Text,
              marginLeft: 8,
            }}>
            {quantity.description}
          </Text>
        </View>
        {isEdit && (
          <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
            <TouchableOpacity
              style={{
                backgroundColor: isDark
                  ? DarkColor.ComponentColor
                  : LightColor.ComponentColor,
                borderRadius: 4,
                padding: 10,
                marginHorizontal: 8,
              }}
              onPress={() => console.log('Minus Clicked ' + quantity.description)}>
              <Icon
                name={'remove'}
                size={14}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: isDark
                  ? DarkColor.ComponentColor
                  : LightColor.ComponentColor,
                borderRadius: 4,
                padding: 10,
              }}
              onPress={() => console.log('Plus Clicked ' + quantity.description)}>
              <Icon
                name={'add'}
                size={14}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 34,
          paddingRight: 16,
          zIndex: 100,
        }}
        onPress={() => setEdit(!isEdit)}>
        <Text
          style={{
            color: isDark ? DarkColor.Background : LightColor.Background,
            marginRight: 6,
          }}>
          {isEdit ? 'APPLIQUER' : 'MODIFIER'}
        </Text>
        <Icon
          name={isEdit ? 'checkmark-circle-outline' : 'create-outline'}
          color={isDark ? DarkColor.Background : LightColor.Background}
          size={24}
        />
      </TouchableOpacity>
      <ScrollView
        style={{
          backgroundColor: isDark
            ? DarkColor.Background
            : LightColor.Background,
        }}>
        <StatusBar
          barStyle={'light-content'}/>
        <View
          style={{
            height: 280,
            backgroundColor: isDark
              ? DarkColor.ComponentColor
              : LightColor.Primary,
          }}>
          {item.hasImage && (
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, right: 0, padding: 20}}
              onPress={() => setFullScreen(true)}>
              <Icon
                name={'expand-outline'}
                size={24}
                color={isDark ? DarkColor.Background : LightColor.Background}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{paddingHorizontal: 16}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 10,
            }}>
            {item.name}
          </Text>
          <Text style={{textAlign: 'center'}}>
            {item.customer}
            {item.price ? ' - ' + item.price + 'K' : ''}
          </Text>
          <View
            style={{
              height: 2,
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              marginVertical: 4,
            }}
          />

          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}>
              Quantité:
            </Text>
            {item.quantity.map((value, index) => {
              return (
                <ItemNumber
                  quantity={value}
                  done={item.done[index].number}
                  key={index}
                />
              );
            })}
          </View>

          <Text style={{marginVertical: 10}}>
            <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>
              Date de livraison:
            </Text>{' '}
            {item.delivery}
          </Text>
          <View style={{marginVertical: 10}}>
            <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>
              Description:
            </Text>
            <TextInput
              multiline={true}
              value={item.description}
              autoCorrect={false}
              keyboardAppearance={isDark ? 'dark' : 'light'}
              editable={isEdit}
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                borderWidth: 1,
                borderColor: 'lightgrey',
                borderRadius: 4,
                lineHeight: 22,
                padding: 8,
                marginTop: 8,
              }}
            />
          </View>
        </View>
        <View style={{height: 40}} />
        <Modal visible={fullScreen} animationType="slide" statusBarTranslucent>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginBottom: StatusBar.currentHeight ? -StatusBar.currentHeight : 0,
              backgroundColor: isDark
                ? DarkColor.Background
                : DarkColor.Background,
            }}>
            <View
              style={{
                height: 400,
                backgroundColor: isDark
                  ? DarkColor.Primary
                  : LightColor.Primary,
              }}
            />
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, right: 0, padding: 20}}
              onPress={() => setFullScreen(false)}>
              <Icon
                name={'contract-outline'}
                size={24}
                color={isDark ? DarkColor.Background : LightColor.Background}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;
