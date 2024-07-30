import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DataType, quantity } from '../../Type';

import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import useTheme from '../../services/Theme';
import { DarkColor, LightColor } from '../../colors/Colors';
import FloatingButton from '../../components/FloatingButton';
import { getDeliveryDate, getDeliveryLate, getDone, getTotal } from '../../services/Functions';

type RootStackParamList = {
  CustomerDetail: { item: DataType };
  OrderList: { item: DataType };
  OrderDetail: { item: DataType };
  OrderImage: { image: string | undefined };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'OrderDetail'>;
  route: RouteProp<RootStackParamList, 'OrderDetail'>;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const OrderDetail = ({ route, navigation }: Props) => {
  const isDark = useTheme();
  const { item } = route.params;

  const [isChange, setChange] = useState(false);
  const [changeDone, setChangeDone] = useState<number[]>(
    Array.from({ length: item.done.length }, () => 0),
  );

  const [isEdit, setEdit] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isFinish, setFinish] = useState(false);

  const [pendingQuantity, setPendingQuantity] = useState<number[]>([0,1]);


  /**
   * handleEdit : Edit the information of an order and push it to the database
   */
  const handleEdit = async () => {
    if (isEdit) {
      let alsoEditDoneDetail = item.done
      for (let range in alsoEditDoneDetail) {
        alsoEditDoneDetail[range]['detail'] = item.quantity[range].detail.trim();
      }

      firestore()
        .collection('orders')
        .doc(item.key)
        .update({
          name: item.name.trim(),
          customer: item.customer.trim(),
          quantity: item.quantity,
          done: alsoEditDoneDetail,
          localImage: item.localImage || null,
          price: isNaN(item.price) ? 0 : item.price,
          description: item.description.trim(),
          delivery: item.delivery.trim(),
          editedOn: item.editedOn,
        })
      setEdit(false);
    } else {
      setEdit(true)
    }
  }

  /**
   * handleChange : increment or decrement the number of an order and push it to the database
   */
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

  /**
   * handleDelete : delete an order
   */
  const handleDelete = () => {
    const deleteOrder = () => {
      firestore().collection('orders').doc(item.key).delete();
      navigation.goBack();
    }
    Alert.alert(
      'Supprimer', 'Voulez-vous vraiment supprimer cette commande ?',
      [
        { isPreferred: false, style: 'cancel', text: 'Annuler' },
        { isPreferred: true, onPress: deleteOrder, style: 'destructive', text: 'Supprimer' },
      ],
      {
        cancelable: true,
        userInterfaceStyle: isDark ? 'dark' : 'light',
      }
    )
  };

  /**
   * handleFinish : finish the order
   */
  const handleFinish = () => {
    const finishOrder = () => {
      if (isFinish) {
        firestore().collection('orders').doc(item.key).update({
          isDone: false
        });
        setFinish(false);
        setEdit(false);
      } else {
        firestore().collection('orders').doc(item.key).update({
          isDone: true
        });
        setFinish(true);
        setEdit(false);
      }
    }
    Alert.alert(
      ((isFinish || getTotal(item.quantity) === getDone(item.done)) ? 'Reprendre' : 'Terminer') + ' la commande',
      'Voulez-vous vraiment ' + ((isFinish || getTotal(item.quantity) === getDone(item.done)) ? 'reprendre' : 'terminer') + ' cette commande ?',
      [
        { isPreferred: false, style: 'cancel', text: 'Annuler' },
        { isPreferred: true, onPress: finishOrder, style: 'default', text: (isFinish || getTotal(item.quantity) === getDone(item.done)) ? 'Reprendre' : 'Terminer' },
      ],
      {
        cancelable: true,
        userInterfaceStyle: isDark ? 'dark' : 'light',
      }
    )
  };

  const detectFinish = () => {
    const getFinish = getDone(item.done) === getTotal(item.quantity);
    setFinish(getFinish || item.isDone);
    return getFinish;
  }

  useEffect(() => {
    detectFinish();
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
    console.log(pendingQuantity);
  }, [changeDone, pendingQuantity]);

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
              borderWidth: 1,
              borderColor: isDark ? DarkColor.ComponentColor : LightColor.ComponentColor,
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
            borderWidth: 1,
            borderColor: isDark ? DarkColor.ComponentColor : LightColor.ComponentColor,
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
                  ? DarkColor.Text
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
                  ? DarkColor.Text
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

      const [bgColor, setBgColor] = useState(1);
      const removeQuantity = () => {
        if (bgColor === 1) {
          setBgColor(0.4);
          setPendingQuantity((prevState) => {
            return prevState?.filter(value => value !== id)
          });
        } else {
          setBgColor(1);
          setPendingQuantity((prevState) => {
            return prevState ? [...prevState, id] : [id];
          });
        };
        // console.log(pendingQuantity);
      };

      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 4,
            opacity: bgColor
          }}>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  done >= quantity.number
                    ? isDark ? DarkColor.SuccessTwo : LightColor.SuccessTwo
                    : isDark
                      ? DarkColor.ComponentColor
                      : LightColor.ComponentColor,
                borderRadius: 4,
                padding: 6,
              }}>
              <Text
                style={{
                  fontSize: 18,
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
                editable={isEdit && bgColor !== 0.4}
                defaultValue={quantity.number.toString()}
                onChangeText={text => (quantity.number = parseInt(text))}
                style={{
                  fontSize: 18,
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
              editable={isEdit && bgColor !== 0.4}
              multiline={true}
              defaultValue={quantity.detail}
              onChangeText={text => (quantity.detail = text)}
              style={{
                fontSize: 16,
                textDecorationLine: bgColor < 1 ? 'line-through' : 'none',
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
                  opacity: done + changeDone[id] === 0 ? 0.4 : 1
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
                opacity: !isEdit ? done + changeDone[id] === quantity.number ? 0.4 : 1 : 1
              }}
              onPress={() => !isEdit ? increment() : removeQuantity()}
              onLongPress={() => !isEdit ? incrementTen() : null}>
              <Icon
                name={!isEdit ? 'add-circle-outline' : bgColor < 1 ? 'arrow-undo-circle-outline' : 'close-circle-outline'}
                size={28}
                color={
                  !isEdit
                    ? isDark
                      ? DarkColor.Background
                      : LightColor.Background
                    : bgColor < 1
                      ? LightColor.Text
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
        backgroundColor: isDark ? DarkColor.Background : LightColor.BackgroundTwo,
      }}>
      {headerRight()}
      <ScrollView>
        <View
          style={{
            height: item.hasImage ? 'auto' : 70,
            backgroundColor: item.hasImage
              ? isDark
                ? DarkColor.BackgroundTwo
                : LightColor.Background
              : isDark
                ? DarkColor.Primary
                : LightColor.Primary
          }}>
          {item.hasImage && (
            <TouchableOpacity
              disabled={isEdit ? true : false}
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
                opacity: isEdit ? 0 : 1,
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

        <View>
          <View style={{
            backgroundColor:
              item.hasImage
                ? isDark ? DarkColor.BackgroundTwo : LightColor.Background
                : isDark ? DarkColor.Primary : LightColor.Primary,
            paddingHorizontal: 16
          }}>
            <TextInput
              editable={isEdit}
              defaultValue={item.name}
              multiline={true}
              style={{
                color: item.hasImage
                  ? isDark ? DarkColor.Text : LightColor.Text
                  : DarkColor.Text,
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
                paddingBottom: 4
              }}>
              <TextInput
                editable={isEdit}
                autoCorrect={false}
                defaultValue={item.customer}
                onChangeText={text => (item.customer = text)}
                style={{
                  color: item.hasImage
                    ? isDark ? DarkColor.Text : LightColor.Text
                    : DarkColor.Text,
                  textAlign: 'right',
                  padding: 0,
                  borderWidth: 1,
                  borderColor: isEdit ? 'lightgrey' : 'transparent',
                  borderRadius: 4,
                  paddingHorizontal: 8,
                }}
              />
              <Text style={{
                color: item.hasImage
                  ? isDark ? DarkColor.Text : LightColor.Text
                  : DarkColor.Text,
              }}>
                -
              </Text>
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
                  color: item.hasImage
                    ? isDark ? DarkColor.Text : LightColor.Text
                    : DarkColor.Text,
                  textAlign: 'left',
                  padding: 0,
                  borderWidth: 1,
                  borderColor: isEdit ? 'lightgrey' : 'transparent',
                  borderRadius: 4,
                  paddingHorizontal: 8,
                }}
              />
            </View>
          </View>

          {
            (isFinish || getTotal(item.quantity) === getDone(item.done) || getDeliveryLate(item.delivery)) &&
            <View style={{
              backgroundColor:
                !isFinish && getDeliveryLate(item.delivery)
                  ? isDark ? DarkColor.Danger : LightColor.Danger
                  : isDark ? DarkColor.Success : LightColor.Success,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              paddingVertical: 4,
              margin: 'auto',
            }}>
              <Icon
                name={!isFinish && getDeliveryLate(item.delivery) ? 'close-circle' : 'checkmark-circle'}
                size={22}
                color={isDark ? DarkColor.Text : LightColor.Background}
              />
              <Text style={{ color: isDark ? DarkColor.Text : LightColor.Background, fontSize: 18, fontWeight: 'bold', opacity: 0.9 }}>
                {!isFinish && getDeliveryLate(item.delivery) ? 'Tard' : 'Terminé'}
              </Text>
            </View>

          }

          <View
            style={{
              backgroundColor: isDark ? DarkColor.BackgroundTwo : LightColor.Background,
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 4,
              marginVertical: 14
            }}>
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
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                disabled={isEdit ? false : true}
                activeOpacity={0.8}
                style={{
                  backgroundColor:
                    item.quantity.length > 9
                      ? 'lightgrey'
                      : isDark
                        ? DarkColor.Primary
                        : LightColor.Primary,
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  margin: 'auto',
                  opacity: isEdit ? 1 : 0
                }}
              // onPress={() => {
              //   setNumberInput([...numberInput, Date.now()]);
              //   setOrder({
              //     ...order,
              //     quantity: [...order.quantity, { number: 0, detail: '' }],
              //     done: [...order.done, { number: 0, detail: '' }],
              //   })
              // }}
              >
                <Icon name={'add'} color={'white'} size={30} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:
                (getDeliveryLate(item.delivery) && !isFinish)
                  ? isDark ? DarkColor.DangerTwo : LightColor.DangerTwo
                  : isDark ? DarkColor.BackgroundTwo : LightColor.Background,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginBottom: 14
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
          <View style={{
            backgroundColor: isDark ? DarkColor.BackgroundTwo : LightColor.Background,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}>
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
              onChangeText={text => (item.description = text)}
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
              }}
              onPress={handleFinish}>
              <Icon name={'checkmark-done'} color={'white'} size={18} />
              <Text style={{ fontSize: 16, color: 'white', marginLeft: 10 }}>
                {(isFinish || getTotal(item.quantity) === getDone(item.done)) ? 'Reprendre' : 'Terminer'} la commande
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
            {item.image && <Image source={{ uri: item.image ? item.image : item.localImage?.toString() }} style={[{ width: '100%', height: '100%' }]} resizeMode='contain' />}
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
