import type { RouteProp } from '@react-navigation/native';
import type { Asset, OptionsCommon } from 'react-native-image-picker';
import type { DataType } from '../../Type';

import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import useTheme from '../../services/Theme';
import { DarkColor, LightColor } from '../../colors/Colors';

type RootStackParamList = {
  OrderList: undefined;
  OrderDetail: { item: DataType };
  NewOrder: { customer?: string };
  CustomerDetail: undefined;
};

type Props = {
  route?: RouteProp<RootStackParamList, 'NewOrder'>;
};

const NewOrder = ({ route }: Props) => {
  const isDark = useTheme();
  const isConnected = useNetInfo();
  const navigation = useNavigation();

  const [order, setOrder] = useState<DataType>({ // New Order State: Datatype
    name: '',
    customer: route?.params?.customer || '',
    hasImage: false,
    image: '',
    localImage: '',
    price: 0,
    delivery: '',
    description: '',
    createdOn: Date.now(),
    editedOn: Date.now(),
    quantity: [{ number: 1, detail: '' }],
    done: [{ number: 0, detail: '' }],
    isDone: false,
    isUrgent: false
  });
  const [imageInfo, setImageInfo] = useState<{ asset: Asset[] | undefined, ref: string }>(); // Image info
  const [numberInput, setNumberInput] = useState<number[]>([Date.now()]); // 

  const option: OptionsCommon = { // Image setting
    mediaType: 'photo',
    maxHeight: 600,
    maxWidth: 600,
    quality: 0.6
  }

  // Controller of Image Picker (Image lib)
  const selectImage = () => {
    launchImageLibrary(option, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorCode);
      } else {
        const source = { uri: res.assets };

        setImageInfo({ asset: source.uri, ref: (Date.now() * (Math.floor(Math.random() * 99) + 1)).toString() });
        setOrder({
          ...order,
          hasImage: true,
          // image: (Math.floor(Math.random() * 10000)).toString(),
          localImage: source.uri ? source.uri[0].uri : ''
        });
      }
    })
  }

  // Controller of Image Picker (Camera)
  const takePhoto = () => {
    launchCamera(option, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorCode);
      } else {
        const source = { uri: res.assets };

        setImageInfo({ asset: source.uri, ref: (Date.now() * (Math.floor(Math.random() * 99) + 1)).toString() });
        setOrder({
          ...order,
          hasImage: true,
          // image: (Math.floor(Math.random() * 10000)).toString(),
          localImage: source.uri ? source.uri[0].uri : ''
        });
      }
    })
  }

  /**
   * showDatePicker : manipulate the date with moment.js
   */
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, date) => {
        setOrder({
          ...order,
          delivery:
            moment(date).calendar() === moment(new Date()).calendar()
              ? ''
              : moment(date).format('DD/MM/YYYY')
        })
      },
      mode: 'date',
      minimumDate: new Date(),
      negativeButton: { label: '' }
    });
  };

  const handleSubmit = async () => {
    try {
      let downloadUrl: string = '';
      
      // Controller of item's image
      if (order.hasImage && isConnected.isConnected) {
        const ref = storage().ref('images/' + imageInfo?.ref);
        const task = await ref.putFile(imageInfo?.asset?.[0].uri ? imageInfo.asset?.[0].uri : '');
        switch (task.state) {
          case 'cancelled':
            console.log('task cancelled');
            break;
          case 'error':
            console.log('task error');
            break;
          case 'paused':
            console.log('task paused');
            break;
          case 'running':
            console.log('task running');
            break;
          case 'success':
            console.log('task success');
            break;
          default:
            throw new Error('Throw new error on task');
        }
        downloadUrl = await storage().ref('images/' + imageInfo?.ref).getDownloadURL();
      }

      // push to the database
      firestore()
        .collection('orders')
        .add({
          name: order.name.trim(),
          customer: order.customer.trim(),
          quantity: order.quantity,
          done: order.done,
          hasImage: order.hasImage,
          image: downloadUrl,
          localImage: order.localImage || null,
          price: isNaN(order.price) ? 0 : order.price,
          description: order.description.trim(),
          delivery: order.delivery.trim(),
          createdOn: order.createdOn,
          editedOn: order.editedOn,
        })
      navigation.goBack(); // Go back to the Main page
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * addNewNumber : Add a new detail in quantity
   * @returns components[]
   */
  const addNewNumber = (): React.ReactNode => {
    return numberInput.map((key, index) => {
      const removeInmput = (key: number, index: number) => {
        setNumberInput(currentInput => {
          return currentInput.filter(value => value !== key);
        });
        setOrder({
          ...order,
          quantity: order.quantity.filter((_, i) => i !== index),
          done: order.done.filter((_, i) => i !== index)
        })
      };

      return (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
          key={key}>
          <View style={{ flex: 2, marginRight: 6 }}>
            <TextInput
              placeholder={'Nombre'}
              placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
              keyboardType={'number-pad'}
              style={[styles.input, { textAlign: 'center', color: isDark ? DarkColor.Text : LightColor.Text }]}
              onChangeText={text => {
                let quantity = order.quantity;
                quantity[index].number = parseInt(text);
                setOrder({
                  ...order,
                  quantity
                })
              }}
            />
          </View>
          <View style={{ flex: 5 }}>
            <TextInput
              placeholder={'Detail'}
              placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
              style={[styles.input, {color: isDark ? DarkColor.Text : LightColor.Text}]}
              onChangeText={text => {
                let quantity = order.quantity;
                quantity[index].detail = text.trim();
                let done = order.done;
                done[index].detail = text.trim();
                setOrder({
                  ...order,
                  quantity,
                  done
                })
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
              disabled={order.quantity.length === 1}
              style={{
                backgroundColor:
                  order.quantity.length === 1
                    ? 'lightgrey'
                    : isDark
                      ? DarkColor.Danger
                      : LightColor.Danger,
                borderRadius: 50,
                marginLeft: 4,
              }}
              onPress={() => {
                removeInmput(key, index);
              }}>
              <Icon name={'remove'} color={'white'} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
      }}>
      <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
        Nouvelle commande
      </Text>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={'none'}
        style={{
          flex: 1,
          backgroundColor: isDark
            ? DarkColor.Background
            : LightColor.Background,
          paddingHorizontal: 14,
          marginTop: 10,
        }}>
        <View style={{ marginBottom: 6 }}>
          {
            imageInfo && (
              <View style={{ alignItems: "center", marginTop: 6, overflow: 'hidden' }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    borderRadius: 50,
                    elevation: 2,
                    zIndex: 100,
                    backgroundColor: isDark ? DarkColor.Background : LightColor.Background
                  }}
                  onPress={() => {
                    setImageInfo(undefined);
                    setOrder({
                      ...order,
                      image: '',
                      localImage: '',
                      hasImage: false
                    })
                  }}
                >
                  <Icon name={'close'} size={30} color={isDark ? DarkColor.Text : LightColor.Text} />
                </TouchableOpacity>
                <Image source={{ uri: imageInfo.asset?.[0].uri }} style={{ width: 300, height: 200, borderRadius: 6 }} resizeMode='cover' />
                {/* { localImage && <Image source={{ uri: localImage }} style={{ width: 300, height: 200, borderRadius: 6 }} resizeMode='cover' />} */}
              </View>
            )
          }
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "center", gap: 10}}>
            <TouchableOpacity onPress={takePhoto}>
              <Icon name={'camera-outline'} size={28} color={isDark ? DarkColor.Secondary : LightColor.Secondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImage}>
              <Icon name={'image-outline'} size={28} color={isDark ? DarkColor.Secondary : LightColor.Secondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold' }}>Nom du produit :</Text>
          <TextInput
            placeholder={'Produit'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={[styles.input, { flex: 1, color: isDark ? DarkColor.Text : LightColor.Text }]}
            value={order.name}
            autoFocus={true}
            onChangeText={text => {
              setOrder({
                ...order,
                name: text
              })
            }}
          />
        </View>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold', marginRight: 4 }}>Client :</Text>
          <TextInput
            placeholder={'Client'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={[styles.input, { flex: 1, color: isDark ? DarkColor.Text : LightColor.Text }]}
            value={order.customer}
            onChangeText={text => {
              setOrder({
                ...order,
                customer: text
              })
            }}
          />
        </View>
        <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold', marginRight: 4 }}>Quantité :</Text>
        {addNewNumber()}
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            disabled={order.quantity.length > 9}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                order.quantity.length > 9
                  ? 'lightgrey'
                  : isDark
                    ? DarkColor.Primary
                    : LightColor.Primary,
              borderRadius: 4,
              paddingHorizontal: 10,
              margin: 'auto',
            }}
            onPress={() => {
              setNumberInput([...numberInput, Date.now()]);
              setOrder({
                ...order,
                quantity: [...order.quantity, { number: 0, detail: '' }],
                done: [...order.done, { number: 0, detail: '' }],
              })
            }}
          >
            <Icon name={'add'} color={'white'} size={30} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold', marginRight: 4 }}>Prix :</Text>
          <TextInput
            placeholder={'0'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={[styles.input, { flex: 1, color: isDark ? DarkColor.Text : LightColor.Text }]}
            onChangeText={text => {
              setOrder({
                ...order,
                price: parseInt(text.trim())
              })
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold', marginRight: 4 }}>Date de livraison :</Text>
          <TextInput
            placeholder={'DD/MM/YYYY'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={[styles.input, { flex: 1, color: isDark ? DarkColor.Text : LightColor.Text }]}
            value={order.delivery}
            onChangeText={text => {
              setOrder({
                ...order,
                delivery: text
              })
            }}
          />
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={showDatePicker}>
            <Icon name={'calendar-outline'} size={30} color={isDark ? DarkColor.Text : LightColor.Text} />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontWeight: 'bold' }}>Description :</Text>
          <TextInput
            placeholder={'...'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={[styles.input, { color: isDark ? DarkColor.Text : LightColor.Text }]}
            multiline={true}
            value={order.description}
            onChangeText={text => {
              setOrder({
                ...order,
                description: text
              })
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: isDark ? DarkColor.Primary : LightColor.Primary,
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 10,
            marginTop: 10,
          }}
          onPress={handleSubmit}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
            Ajouter
          </Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: '100%',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
