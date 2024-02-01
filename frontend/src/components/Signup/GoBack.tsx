import React from 'react';
import {Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ant from 'react-native-vector-icons/AntDesign';

interface GoBackProps extends TouchableOpacityProps {
  onPress?: () => void;
}

const GoBack: React.FC<GoBackProps> = ({onPress}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={onPress ? onPress : () => navigation.goBack()}>
      <Text>
        <Ant name="arrowleft" size={40} color="black" />
      </Text>
    </TouchableOpacity>
  );
};

export default GoBack;
