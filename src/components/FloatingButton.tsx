import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LightColor } from '../colors/Colors';

type Props = {
  backgroundColor: string
  onPress: () => void
};

const FloatingButton: React.FC<Props> = ({backgroundColor, onPress}) => {
  return (
    <TouchableOpacity style={{ backgroundColor, position: 'absolute', bottom: 20, right: 20, borderRadius: 100, padding: 10, elevation: 8}} onPress={onPress}>
        <Icon name={'add'} size={34} color={LightColor.Background} />
    </TouchableOpacity>
  );
};

export default FloatingButton;
