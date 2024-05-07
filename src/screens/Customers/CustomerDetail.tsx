import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { DataType } from 'Type';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import useTheme from 'services/Theme';
import { DarkColor, LightColor } from '../../colors/Colors';
import FloatingButton from 'components/FloatingButton';

type RootStackParamList = {
    Customer: undefined;
    CustomerDetail: { customer: string };
    OrderDetail: { item: DataType };
    NewOrder: { customer: string };
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'OrderDetail'>;
    route: RouteProp<RootStackParamList, 'CustomerDetail'>;
};

const CustomerDetail = ({ route, navigation }: Props) => {
    const isDark = useTheme();

    const [items, setItems] = useState<DataType[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        const subscriber = firestore()
            .collection('orders')
            .where('customer', '==', route.params.customer)
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
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: isDark ? DarkColor.Background : LightColor.Background,
                paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10
            }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: isDark ? DarkColor.Text : LightColor.Text }}>{route.params.customer}</Text>
            <Text style={{ textAlign: 'center', color: isDark ? DarkColor.Text : LightColor.Text }}>Commandes</Text>
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
                <ScrollView>
                    {items?.map((value, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: isDark ? DarkColor.ComponentColor : LightColor.Background,
                                    borderRadius: 6,
                                    padding: 12,
                                    marginVertical: 6,
                                    marginHorizontal: 18,
                                    elevation: 4
                                }}
                                onPress={() => navigation.navigate('OrderDetail', { item: items[index] })}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? DarkColor.Text : LightColor.Text, marginBottom: 4 }}>{value.name}</Text>
                                {
                                    value.quantity.map((q, i) => {
                                        return (
                                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4, marginHorizontal: 10 }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    backgroundColor: value.done[i].number === q.number
                                                        ? isDark ? '#e4f3e4aa' : '#e4f3e4'
                                                        : isDark
                                                          ? DarkColor.ComponentColor
                                                          : LightColor.ComponentColor,
                                                    borderRadius: 4,
                                                    padding: 6
                                                }}>
                                                    <Text style={{ fontSize: 16, color: isDark ? DarkColor.Text : LightColor.Text }}>{value.done[i].number}</Text>
                                                    <Text style={{ fontSize: 16, color: isDark ? DarkColor.Text : LightColor.Text }}>/</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? DarkColor.Text : LightColor.Text }}>{q.number}</Text>
                                                </View>
                                                <Text style={{ color: isDark ? DarkColor.Text : LightColor.Text, fontSize: 16, marginLeft: 4 }}>{q.detail}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </TouchableOpacity>
                        )
                    })}
                    <View style={{ height: 80 }} />
                </ScrollView>
            )
            }
            <FloatingButton backgroundColor={isDark ? DarkColor.Primary : LightColor.Primary} icon={'add'} onPress={() => navigation.navigate('NewOrder', { customer: route.params.customer })} />
        </View >
    );
};

export default CustomerDetail;
