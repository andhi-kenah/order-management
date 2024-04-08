import type {StackNavigationProp} from '@react-navigation/stack';
import type {DataType} from '../../Data';
import React, {useState} from 'react';
import {
  useColorScheme,
  TextInput,
  StyleSheet,
  ScrollView,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {DarkColor, LightColor} from '../../colors/Colors';

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: {item: DataType};
  NewOrder: undefined;
};
type NavigationProps = StackNavigationProp<OrderStackParamList, 'OrderList'>;

type Prop = {
  navigation: NavigationProps;
};

const NewOrder: React.FC<Prop> = ({navigation}) => {
  const isDark = useColorScheme() === 'dark';

  const [name, setName] = useState('');
  const [customer, setCustomer] = useState('');
  const [quantity, setQuantity] = useState<{number: number; detail: string}[]>([
    {number: 0, detail: ''},
  ]);
  const [done, setDone] = useState<{number: number; detail: string}[]>([
    {number: 0, detail: ''},
  ]);
  const [hasImage, setHasImage] = useState(false);
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('');
  const [description, setDescription] = useState('');

  let [numberInput, setNumberInput] = useState<number[]>([Date.now()]);

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
          price: isNaN(parseInt(price.trim())) ? 0 : parseInt(price),
          description: description.trim(),
          delivery: delivery.trim(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        
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
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}
          key={key}>
          <View style={{flex: 2, marginRight: 6}}>
            <TextInput
              placeholder={'Nombre'}
              keyboardType={'number-pad'}
              style={[styles.input, {textAlign: 'center'}]}
              onChangeText={text => (quantity[index].number = parseInt(text))}
            />
          </View>
          <View style={{flex: 5}}>
            <TextInput
              placeholder={'Detail'}
              style={[styles.input]}
              onChangeText={text => {
                quantity[index].detail = text.trim();
                done[index].detail = text.trim();
              }}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableHighlight
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
            </TouchableHighlight>
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
      <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 10}}>
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
        <View style={{marginBottom: 6}}>
          <TextInput
            placeholder={'Nom du produit'}
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={{marginBottom: 6}}>
          <TextInput
            placeholder={'Client'}
            style={styles.input}
            value={customer}
            onChangeText={text => setCustomer(text)}
          />
        </View>
        {addNewNumber()}
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <TouchableHighlight
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
            activeOpacity={0.9}
            underlayColor={'lightgrey'}
            onPress={() => {
              setNumberInput([...numberInput, Date.now()]);
              setQuantity(prev => [...prev, {number: 0, detail: ''}]);
              setDone(prev => [...prev, {number: 0, detail: ''}]);
            }}>
            <Icon name={'add'} color={'white'} size={30} />
          </TouchableHighlight>
        </View>
        <View style={{marginBottom: 6}}>
          <TextInput
            placeholder={'Prix'}
            style={styles.input}
            value={price}
            onChangeText={text => setPrice(text)}
          />
        </View>
        <View style={{marginBottom: 6}}>
          <TextInput
            placeholder={'Date de livraison'}
            style={styles.input}
            value={delivery}
            onChangeText={text => setDelivery(text)}
          />
        </View>
        <View style={{marginBottom: 6}}>
          <TextInput
            placeholder={'Description'}
            style={styles.input}
            multiline={true}
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>
        <TouchableHighlight
          underlayColor={'lightgrey'}
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
        </TouchableHighlight>
        <View style={{height: 50}} />
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
