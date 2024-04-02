import React, {createContext, useState} from 'react';
import {DataType, data} from './Data'

type ContextDataType = {
    items: DataType[],
    newItem: (items: DataType) => void;
}

export const ContextData = createContext<ContextDataType>({
    items: [],
    newItem: () => {}
});


export const ContextProvider: React.FC<React.PropsWithChildren> = ({children}: React.PropsWithChildren) => {
    const [items, setItems] = useState<DataType[]>(data);

    const newItem = (item: DataType) => {
        setItems(prevData => [...prevData, item]);
    }

    return (
        <ContextData.Provider value={{items, newItem}}>
            {children}
        </ContextData.Provider>
    )
}