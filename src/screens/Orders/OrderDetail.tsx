import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DataType, quantity } from '../../Data';

import React, { memo, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import useTheme from '../../services/Theme';
import { DarkColor, LightColor } from '../../colors/Colors';
import FloatingButton from '../../components/FloatingButton';
import { getDeliveryDate } from '../../services/Functions';

type RootStackParamList = {
  OrderList: { item: DataType };
  OrderDetail: { item: DataType };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'OrderDetail'>;
  route: RouteProp<RootStackParamList, 'OrderDetail'>;
};

const OrderDetail = ({ route, navigation }: Props) => {
  const isDark = useTheme();
  const { item } = route.params;

  const [isChange, setChange] = useState<boolean>(false);
  const [changeDone, setChangeDone] = useState<number[]>(
    Array.from({ length: item.done.length }, () => 0),
  );

  const [isEdit, setEdit] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const handleEdit = async () => {
    if (isEdit) {
      firestore()
        .collection('orders')
        .doc(item.key)
        .update({
          // editedOn: 
        })
      console.log(item.createdOn);
      console.log(item.editedOn);
      setEdit(false);
    } else {
      setEdit(true)
    }
  }

  const handleChange = async () => {
    try {
      let newDone: quantity[] = [];
      if (newDone) {
        for (let n in changeDone) {
          let d: quantity = {
            number: changeDone[n] + item.done[n].number,
            detail: item.done[n].detail,
          };
          newDone = [...newDone, d];
        }
      }

      setChangeDone(Array.from({ length: item.done.length }, () => 0));
      setChange(false);
      item.done = newDone;

      await firestore().collection('orders').doc(item.key).update({
        done: newDone,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = () => {
    firestore().collection('orders').doc(item.key).delete();
  };

  useEffect(() => {
    let change = 0;
    for (let i = 0; i < changeDone.length; i++) {
      if (changeDone[i] !== 0) {
        change += 1;
      } else {
        change += 0;
      }
    }
    if (change) {
      setChange(true);
    } else {
      setChange(false);
    }
  }, [changeDone]);

  const headerRight = () => {
    return (
      <View style={{
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
        right: 0,
        flexDirection: 'row',
        zIndex: 100
      }}>
        {isEdit &&
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark
                ? DarkColor.Background
                : LightColor.Background,
              borderRadius: 4,
              paddingVertical: 4,
              paddingLeft: 10,
              paddingRight: 8,
              marginRight: 10,
              elevation: 1,
            }}
            onPress={() => setEdit(false)}>
            <Text
              style={{
                color: isDark
                  ? DarkColor.Text
                  : LightColor.Text,
                marginRight: 6,
              }}>
              ANNULER
            </Text>
            <Icon
              name={'close-circle-outline'}
              color={isDark
                ? DarkColor.Text
                : LightColor.Text
              }
              size={24}
            />
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isEdit
              ? isDark
                ? DarkColor.Primary
                : LightColor.Primary
              : isDark
                ? DarkColor.Background
                : LightColor.Background,
            borderRadius: 4,
            paddingVertical: 4,
            paddingLeft: 10,
            paddingRight: 8,
            marginRight: 10,
            elevation: 1,
          }}
          onPress={handleEdit}>
          <Text
            style={{
              color: isEdit
                ? isDark
                  ? DarkColor.Background
                  : LightColor.Background
                : isDark
                  ? DarkColor.Text
                  : LightColor.Text,
              marginRight: 6,
            }}>
            {isEdit ? 'APPLIQUER' : 'MODIFIER'}
          </Text>
          <Icon
            name={isEdit ? 'checkmark-circle-outline' : 'create-outline'}
            color={
              isEdit
                ? isDark
                  ? DarkColor.Background
                  : LightColor.Background
                : isDark
                  ? DarkColor.Text
                  : LightColor.Text
            }
            size={24}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const ItemNumber = memo(
    ({ id, quantity, done }: { id: number; quantity: quantity; done: number }) => {
      const decrement = () => {
        const updatedAreas = JSON.parse(JSON.stringify(changeDone));
        updatedAreas[id] -= 1;
        setChangeDone(updatedAreas);
      };

      const increment = () => {
        const updatedAreas = JSON.parse(JSON.stringify(changeDone));
        updatedAreas[id] += 1;
        setChangeDone(updatedAreas);
      };

      const incrementTen = () => {
        const updatedAreas = JSON.parse(JSON.stringify(changeDone));
        if (
          item.done[id].number + changeDone[id] + 10 <=
          item.quantity[id].number
        ) {
          updatedAreas[id] += 10;
          setChangeDone(updatedAreas);
        } else {
          updatedAreas[id] = item.quantity[id].number;
          setChangeDone(updatedAreas);
        }
      };

      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 4,
          }}>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  done >= quantity.number
                    ? '#e4f3e4'
                    : isDark
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
              <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text }}>
                {changeDone[id] === 0
                  ? ''
                  : (changeDone[id] > 0 ? '+' : '') + changeDone[id].toString()}
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
                disabled={done + changeDone[id] === 0}
                style={{
                  backgroundColor: isDark
                    ? DarkColor.Secondary
                    : LightColor.Secondary,
                  borderRadius: 4,
                  padding: 4,
                  marginHorizontal: 8,
                }}
                onPress={decrement}>
                <Icon
                  name={'remove-circle-outline'}
                  size={28}
                  color={isDark ? DarkColor.Background : LightColor.Background}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={
                !isEdit ? done + changeDone[id] === quantity.number : false
              }
              style={{
                backgroundColor: !isEdit
                  ? isDark
                    ? DarkColor.Primary
                    : LightColor.Primary
                  : isDark
                    ? DarkColor.ComponentColor
                    : LightColor.ComponentColor,
                borderRadius: 4,
                padding: 4,
              }}
              onPress={increment}
              onLongPress={incrementTen}>
              <Icon
                name={!isEdit ? 'add-circle-outline' : 'close-circle-outline'}
                size={28}
                color={
                  !isEdit
                    ? isDark
                      ? DarkColor.Background
                      : LightColor.Background
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
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {headerRight()}
      <ScrollView>
        <View
          style={{
            height: item.hasImage ? 'auto' : 70,
            backgroundColor: isDark
              ? DarkColor.Background
              : LightColor.Background,
          }}>
          {item.hasImage && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: isDark
                  ? DarkColor.Background
                  : LightColor.Background,
                height: 34,
                width: 34,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                zIndex: 100
              }}
              onPress={() => setFullScreen(true)}>
              <Icon
                name={'expand-outline'}
                color={
                  isDark
                    ? DarkColor.Text
                    : LightColor.Text
                }
                size={22}
              />
            </TouchableOpacity>
          )}
          {/* {item.localImage && <Image source={{ uri: item.localImage }} style={{ width: '100%', height: 280 }} />} */}
          {item.image && <Image source={{ uri: item.image }} style={{ width: '100%', height: 280 }} />}
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <TextInput
            editable={isEdit}
            defaultValue={item.name}
            multiline={true}
            style={{
              color: isDark ? DarkColor.Text : LightColor.Text,
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              borderWidth: 1,
              borderColor: isEdit ? '#5552' : 'transparent',
              borderRadius: 4,
              paddingTop: 0,
              paddingBottom: 0,
              marginVertical: 6,
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
                color: isDark ? DarkColor.Text : LightColor.Text,
                textAlign: 'right',
                padding: 0,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingHorizontal: 8,
              }}
            />
            <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text }}>-</Text>
            <TextInput
              editable={isEdit}
              autoCorrect={false}
              defaultValue={
                isEdit
                  ? item.price.toString()
                  : (item.price / 1000).toString() + 'K'
              }
              onChangeText={text => (item.price = parseInt(text))}
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
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

          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'grid-outline'}
                size={24}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
              <Text
                style={{
                  color: isDark ? DarkColor.Text : LightColor.Text,
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}>
                Quantité{' '}:
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
                fontSize: 18,
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}>
              Livraison{' '}:
            </Text>
            <TextInput
              editable={isEdit}
              defaultValue={
                isEdit
                  ? item.delivery
                  : getDeliveryDate(item.delivery, 'full-date')
              }
              onChangeText={text => (item.delivery = text)}
              style={{
                color: isDark ? DarkColor.Text : LightColor.Text,
                borderWidth: 1,
                borderColor: isEdit ? 'lightgrey' : 'transparent',
                borderRadius: 4,
                paddingHorizontal: 2,
                paddingVertical: 4,
                marginLeft: 4,
              }}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'chatbox-ellipses-outline'}
                size={24}
                color={isDark ? DarkColor.Text : LightColor.Text}
              />
              <Text
                style={{
                  color: isDark ? DarkColor.Text : LightColor.Text,
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}>
                Description{' '}:
              </Text>
            </View>
            <TextInput
              multiline={true}
              defaultValue={item.description}
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
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginVertical: 30,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? DarkColor.Danger : LightColor.Danger,
                borderRadius: 4,
                paddingHorizontal: 16,
                paddingVertical: 8,
                elevation: 2,
              }}
              onPress={handleDelete}>
              <Icon name={'trash'} color={'white'} size={18} />
              <Text style={{ fontSize: 16, color: 'white', marginLeft: 10 }}>
                Supprimer la commande
              </Text>
            </TouchableOpacity>
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
                elevation: 2,
              }}>
              <Icon name={'checkmark-done'} color={'white'} size={18} />
              <Text style={{ fontSize: 16, color: 'white', marginLeft: 10 }}>
                Terminer la commande
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 40 }} />
        <Modal visible={fullScreen} animationType="slide" statusBarTranslucent={true} onRequestClose={() => setFullScreen(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginTop: StatusBar.currentHeight
                ? -StatusBar.currentHeight
                : 0,
              marginBottom: StatusBar.currentHeight
                ? -StatusBar.currentHeight
                : 0,
              backgroundColor: isDark
                ? DarkColor.Background
                : LightColor.Background,
            }}>
            {/* {item.localImage && <Image source={{ uri: item.localImage }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />} */}
            {item.image && <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />}

            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: isDark
                  ? DarkColor.Background
                  : LightColor.Background,
                height: 34,
                width: 34,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                zIndex: 100
              }}
              onPress={() => setFullScreen(false)}>
              <Icon
                name={'contract-outline'}
                color={
                  isDark
                    ? DarkColor.Text
                    : LightColor.Text
                }
                size={22}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
      {isChange && !isEdit && (
        <FloatingButton
          title={'Enregister'}
          icon={'save'}
          backgroundColor={isDark ? DarkColor.Success : LightColor.Success}
          onPress={handleChange}
        />
      )}
    </View>
  );
};

export default OrderDetail;
