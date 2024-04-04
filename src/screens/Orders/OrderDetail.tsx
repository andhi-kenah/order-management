import type {RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {DataType} from 'services/Data';

import React, {memo, useEffect, useRef, useState} from 'react';
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
import FloatingButton from 'components/FloatingButton';

type RootStackParamList = {
  OrderList: {item: DataType};
  OrderDetail: {item: DataType};
};
type Props = {
  route: RouteProp<RootStackParamList, 'OrderDetail'>;
};
type quantity = {
  number: number;
  detail: string;
};

const OrderDetail: React.FC<Props> = ({route}) => {
  const isDark = useColorScheme() === 'dark';
  const {item} = route.params;

  const [isChange, setChange] = useState<boolean>(false);
  const editQuantityDone = useRef<quantity[]>(item.done);

  const [isEdit, setEdit] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const handleEdit = () => {
    if (isEdit) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  useEffect(() => {
    console.log(editQuantityDone.current);
    
    // if (editQuantityDone.current === item.done) {
    //   setChange(false);
    //   console.log('====================================');
    //   console.log('true');
    //   console.log(editQuantityDone);
    //   console.log(item.done);
    //   console.log('====================================');
    // } else {
    //   setChange(true);
    //   console.log('====================================');
    //   console.log('false');
    //   console.log(editQuantityDone);
    //   console.log(item.done);
    //   console.log('====================================');
    // }
  }, []);

  const ItemNumber = memo(
    ({id, quantity, done}: {id: number; quantity: quantity; done: number}) => {
      const [number, setNumber] = useState<number>(0);
      const decrement = () => {
        setNumber(prev => (prev -= 1));
        const updatedAreas = JSON.parse(
          JSON.stringify(editQuantityDone.current),
        );
        updatedAreas[id]['number'] -= 1;
        editQuantityDone.current = updatedAreas;
      };

      const increment = () => {
        setNumber(prev => (prev += 1));
        const updatedAreas = JSON.parse(
          JSON.stringify(editQuantityDone.current),
        );
        updatedAreas[id]['number'] += 1;
        editQuantityDone.current = updatedAreas;
      };

      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 4,
          }}>
          <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
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
              <Text>
                {!number ? '' : (number > 0 ? '+' : '') + number.toString()}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  color: isDark ? DarkColor.Text : LightColor.Text,
                }}>
                /
              </Text>
              <TextInput
                editable={isEdit}
                defaultValue={quantity.number.toString()}
                onChangeText={text => (quantity.number = parseInt(text))}
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: isDark ? DarkColor.Text : LightColor.Text,
                  borderWidth: 1,
                  borderColor: isEdit ? 'lightgrey' : 'transparent',
                  borderRadius: 4,
                  verticalAlign: 'middle',
                  paddingVertical: 0,
                }}
              />
            </View>
            <TextInput
              editable={isEdit}
              multiline={true}
              defaultValue={quantity.detail}
              onChangeText={text => (quantity.detail = text)}
              style={{
                fontSize: 16,
                color: isDark ? DarkColor.Text : LightColor.Text,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'stretch',
              justifyContent: 'flex-end',
            }}>
            {!isEdit && (
              <TouchableOpacity
                disabled={done + number === 0}
                style={{
                  backgroundColor: '#e0e0e088',
                  borderRadius: 4,
                  padding: 4,
                  marginHorizontal: 8,
                }}
                onPress={decrement}>
                <Icon
                  name={'remove-circle-outline'}
                  size={28}
                  color={isDark ? DarkColor.Secondary : LightColor.Secondary}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={!isEdit ? done + number === quantity.number : false}
              style={{
                backgroundColor: '#e0e0e088',
                borderRadius: 4,
                padding: 4,
              }}
              onPress={increment}>
              <Icon
                name={!isEdit ? 'add-circle-outline' : 'close-circle-outline'}
                size={28}
                color={
                  !isEdit
                    ? isDark
                      ? DarkColor.Primary
                      : LightColor.Primary
                    : isDark
                    ? DarkColor.Danger
                    : LightColor.Danger
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
  );

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 12,
          right: 10,
          backgroundColor: isEdit
            ? isDark
              ? DarkColor.Background
              : LightColor.Background
            : isDark
            ? DarkColor.Primary
            : LightColor.Primary,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isEdit ? '#8888' : 'transparent',
          borderRadius: 4,
          paddingVertical: 4,
          paddingLeft: 10,
          paddingRight: 6,
          zIndex: 100,
        }}
        onPress={handleEdit}>
        <Text
          style={{
            color: isEdit
              ? isDark
                ? DarkColor.Text
                : LightColor.Text
              : isDark
              ? DarkColor.Background
              : LightColor.Background,
            marginRight: 6,
          }}>
          {isEdit ? 'APPLIQUER' : 'MODIFIER'}
        </Text>
        <Icon
          name={isEdit ? 'checkmark-circle-outline' : 'create-outline'}
          color={
            isEdit
              ? isDark
                ? DarkColor.Text
                : LightColor.Text
              : isDark
              ? DarkColor.Background
              : LightColor.Background
          }
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
          barStyle={'light-content'}
          backgroundColor={isDark ? DarkColor.Primary : LightColor.Primary}
        />
        <View
          style={{
            height: item.hasImage ? 280 : 56,
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
          <TextInput
            editable={isEdit}
            defaultValue={item.name}
            multiline={true}
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              borderWidth: 1,
              borderColor: isEdit ? '#5552' : 'transparent',
              borderRadius: 4,
              paddingBottom: 2,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextInput
              editable={isEdit}
              autoCorrect={false}
              defaultValue={item.customer}
              onChangeText={text => (item.customer = text)}
              style={{
                textAlign: 'right',
                padding: 0,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingHorizontal: 8,
              }}
            />
            <Text>{'-'}</Text>
            <TextInput
              editable={isEdit}
              autoCorrect={false}
              defaultValue={item.price.toLocaleString()}
              onChangeText={text => (item.price = parseInt(text))}
              style={{
                textAlign: 'left',
                padding: 0,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingHorizontal: 8,
              }}
            />
          </View>

          <View
            style={{
              height: 2,
              backgroundColor: isDark
                ? DarkColor.ComponentColor
                : LightColor.ComponentColor,
              marginVertical: 4,
            }}
          />

          <View style={{marginVertical: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'list-outline'}
                size={24}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
              <Text
                style={{
                  color: isDark ? DarkColor.Text : LightColor.Text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}>
                Quantité{''}:
              </Text>
            </View>
            {item.quantity.map((value, index) => {
              return (
                <ItemNumber
                  quantity={value}
                  done={item.done[index].number}
                  key={index}
                  id={index}
                />
              );
            })}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <Icon
              name={'calendar-outline'}
              size={24}
              color={isDark ? DarkColor.Text : LightColor.Text}
            />
            <Text
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                fontSize: 16,
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}>
              Livraison{''}:
            </Text>
            <TextInput
              editable={isEdit}
              defaultValue={item.delivery}
              onChangeText={text => (item.delivery = text)}
              style={{
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingHorizontal: 2,
                paddingVertical: 4,
                marginLeft: 4,
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'text-outline'}
                size={24}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
              <Text
                style={{
                  color: isDark ? DarkColor.Text : LightColor.Text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}>
                Description{''}:
              </Text>
            </View>
            <TextInput
              multiline={true}
              value={item.description}
              autoCorrect={false}
              keyboardAppearance={isDark ? 'dark' : 'light'}
              editable={isEdit}
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                lineHeight: 22,
                marginHorizontal: -4,
              }}
            />
          </View>
        </View>
        {isEdit && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginVertical: 30,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark
                  ? DarkColor.Success
                  : LightColor.Success,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                elevation: 4,
              }}>
              <Icon name={'checkmark-done'} color={'white'} size={18} />
              <Text style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                Terminer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? DarkColor.Danger : LightColor.Danger,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                elevation: 4,
              }}>
              <Icon name={'trash'} color={'white'} size={18} />
              <Text style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{height: 40}} />
        <Modal visible={fullScreen} animationType="slide" statusBarTranslucent>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginBottom: StatusBar.currentHeight
                ? -StatusBar.currentHeight
                : 0,
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
      {isChange && !isEdit && (
        <FloatingButton
          icon={'save'}
          backgroundColor={isDark ? DarkColor.Success : LightColor.Success}
          onPress={() => {}}
        />
      )}
    </View>
  );
};

export default OrderDetail;
