import React, { useContext } from "react";
import { ContextData } from "./Context";

export type DataType = {
  id: string,
  name: string,
  customer: string,
  quantity: {number: number, description: string}[],
  done: {number: number, description: string}[],
  hasImage: boolean,
  image?: string | null,
  price: number,
  description: string,
  delivery: string,
}

export let data: DataType[] = [
  {
    id: '0',
    name: 'Sac ceinture',
    customer: 'Grande surface',
    quantity: [{number: 4, description: 'Thé'}],
    done: [{number: 1, description: 'Thé'}],
    hasImage: true,
    image: '',
    price: 70,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus, saepe.',
    delivery: '10/12/2024',
  },
  {
    id: '1',
    name: 'Sac rond MS GM',
    customer: 'Client Dubai',
    quantity: [{number: 10, description: 'Naturel'}, {number: 10, description: 'Noir'}],
    done: [{number: 10, description: 'Naturel'}, {number: 4, description: 'Noir'}],
    hasImage: false,
    image: null,
    price: 110,
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas perferendis, hic neque libero accusantium quidem illo pariatur eveniet culpa quis.',
    delivery: '20/11/2024',
  },
  {
    id: '3',
    name: 'Sac rectangle DB MM',
    customer: 'Tanjombato',
    quantity: [{number: 1, description: 'Noir'}],
    done: [{number: 0, description: 'Noir'}],
    hasImage: true,
    image: '',
    price: 67,
    description: 'Lorem ipsum dolor sit amet.',
    delivery: '10/12/2024',
  },
  {
    id: '4',
    name: 'Sac rond PR modele Pinterest',
    customer: 'Client Australie',
    quantity: [{number: 1, description: 'Thé'}, {number: 1, description: 'Naturel'}],
    done: [{number: 1, description: 'Thé'}, {number: 0, description: 'Naturel'}],
    hasImage: false,
    image: '',
    price: 95,
    description: 'Lorem ispum dolor concatenator',
    delivery: '20/11/2024',
  },
];

export const useData = () => {
  const context = useContext(ContextData);
  if (!context) {
    throw new Error("useData must be used within ContextProvider");
  }
  return context;
}