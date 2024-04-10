import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DataType } from '../../Data';
import React, { useState } from 'react';
import {
  useColorScheme,
  TextInput,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Asset, OptionsCommon, launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { DarkColor, LightColor } from '../../colors/Colors';

type RootStackParamList = {
  OrderList: undefined;
  OrderDetail: { item: DataType };
  NewOrder: undefined;
  CustomerDetail: { customer: string }
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'OrderDetail'>;
  route: RouteProp<RootStackParamList, 'CustomerDetail'>;
};

const NewOrder = ({ route, navigation }: Props) => {
  const isDark = useColorScheme() === 'dark';

  const [imageInfo, setImageInfo] = useState<Asset[] | undefined>();

  const [name, setName] = useState('');
  const [customer, setCustomer] = useState(route.params?.customer || '');
  const [quantity, setQuantity] = useState<{ number: number; detail: string }[]>([
    { number: 0, detail: '' },
  ]);
  const [done, setDone] = useState<{ number: number; detail: string }[]>([
    { number: 0, detail: '' },
  ]);
  const [hasImage, setHasImage] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | undefined | null>(null);
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('');
  const [description, setDescription] = useState('');

  let [numberInput, setNumberInput] = useState<number[]>([Date.now()]);

  const selectImage = () => {
    const option: OptionsCommon = {
      mediaType: 'photo',
      maxHeight: 600,
      maxWidth: 600,
      quality: 0.6
    }
    launchImageLibrary(option, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const source = { uri: response.assets };
        setImageInfo(source.uri);
        setImage((Math.floor(Math.random() * 10000)).toString());
        setLocalImage(source.uri ? source.uri[0].uri : '');
        setHasImage(true);
      }
    })
  }

  const handleSubmit = () => {
    try {
      firestore()
        .collection('orders')
        .add({
          name: name.trim(),
          customer: customer.trim(),
          quantity,
          done,
          hasImage,
          image,
          localImage,
          price: isNaN(parseInt(price.trim())) ? 0 : parseInt(price),
          description: description.trim(),
          delivery: delivery.trim(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Image name'+ image);
      console.log('hasImage'+ hasImage);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const addNewNumber = (): React.ReactNode => {
    return numberInput.map((key, index) => {
      const removeInmput = (key: number, index: number) => {
        setNumberInput(currentInput => {
          return currentInput.filter(value => value !== key);
        });
        setQuantity(currentQuantity => {
          return currentQuantity.filter((_, i) => i !== index);
        });
        setDone(currentDone => {
          return currentDone.filter((_, i) => i !== index);
        });
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
              style={[styles.input, { textAlign: 'center' }]}
              onChangeText={text => (quantity[index].number = parseInt(text))}
            />
          </View>
          <View style={{ flex: 5 }}>
            <TextInput
              placeholder={'Detail'}
              placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
              style={[styles.input]}
              onChangeText={text => {
                quantity[index].detail = text.trim();
                done[index].detail = text.trim();
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
              disabled={quantity.length === 1}
              style={{
                backgroundColor:
                  quantity.length === 1
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
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
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
                    onPress={() => {setImageInfo(undefined);setImage(null);setLocalImage(null);setHasImage(false)}}>
                  <Icon name={'close'} size={30} color={isDark ? DarkColor.Text : LightColor.Text} />
                </TouchableOpacity>
                <Image source={{ uri: imageInfo[0].uri }} style={{ width: 300, height: 200, borderRadius: 6 }} resizeMode='cover' />
                {/* { localImage && <Image source={{ uri: localImage }} style={{ width: 300, height: 200, borderRadius: 6 }} resizeMode='cover' />} */}
              </View>
            )
          }
          <TouchableOpacity onPress={selectImage}>
            <Icon name={'image-outline'} size={28} color={isDark ? DarkColor.Secondary : LightColor.Secondary} style={{ textAlign: 'center' }} />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            placeholder={'Nom du produit'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            placeholder={'Client'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={styles.input}
            value={customer}
            onChangeText={text => setCustomer(text)}
          />
        </View>
        {addNewNumber()}
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            disabled={quantity.length > 9}
            style={{
              backgroundColor:
                quantity.length > 9
                  ? 'lightgrey'
                  : isDark
                    ? DarkColor.Primary
                    : LightColor.Primary,
              borderRadius: 4,
              paddingHorizontal: 10,
              margin: 'auto',
            }}
            activeOpacity={0.8}
            onPress={() => {
              setNumberInput([...numberInput, Date.now()]);
              setQuantity(prev => [...prev, { number: 0, detail: '' }]);
              setDone(prev => [...prev, { number: 0, detail: '' }]);
            }}>
            <Icon name={'add'} color={'white'} size={30} />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            placeholder={'Prix'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={styles.input}
            value={price}
            onChangeText={text => setPrice(text)}
          />
        </View>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            placeholder={'Date de livraison'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={styles.input}
            value={delivery}
            onChangeText={text => setDelivery(text)}
          />
        </View>
        <View style={{ marginBottom: 6 }}>
          <TextInput
            placeholder={'Description'}
            placeholderTextColor={isDark ? DarkColor.Secondary : LightColor.Secondary}
            style={styles.input}
            multiline={true}
            value={description}
            onChangeText={text => setDescription(text)}
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
