import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {LightColor} from '../colors/Colors';

type Props = {
  title?: string;
  icon: string;
  backgroundColor: string;
  onPress: () => void;
};

const FloatingButton: React.FC<Props> = ({
  title,
  icon,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor,
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        padding: 10,
        elevation: 4,
      }}
      onPress={onPress}>
      {title && <Text style={{color: 'white', fontSize: 16, marginLeft: 8, marginRight: 8}}>{title}</Text>}
      <Icon name={icon} size={title ? 28 : 34} color={LightColor.Background} style={{marginRight: title ? 6 : 0}} />
    </TouchableOpacity>
  );
};

export default FloatingButton;
