import styled, {css} from '@emotion/native';
import {Text, View, TouchableOpacity} from 'react-native';
import Ant from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface Innertext {
  title: string;
  icon: string;
  iconType: 'Ant' | 'MaterialIcons' | 'FontAwesome6' | 'MaterialCommunityIcons'; // 아이콘 타입을 지정하는 속성 추가
  onPress?: () => any;
}
const InnerContainerBoxhorizontal = styled.TouchableOpacity`
  height: 60px;
  width: 100%;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;
const IconBackground = styled.View`
  height: 36px;
  width: 36px;
  background-color: #f4fdf9;
  border-radius: 20px;
  margin-left: 10px;
  margin-right: 20px;
  position: relative;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Mypagelist = (props: Innertext) => {
  const {iconType, onPress, ...restProps} = props; // iconType을 제외한 나머지 props를 추출

  return (
    <InnerContainerBoxhorizontal onPress={onPress}>
      <View
        style={css`
          width: 90%;
          justify-content: space-between;
          flex-direction: row;
          align-items: center;
        `}>
        <View
          style={css`
            width: 100%;
            flex-direction: row;
            align-items: center;
          `}>
          <IconBackground>
            {iconType === 'Ant' && ( // 아이콘 타입에 따라 조건부 렌더링
              <Ant
                style={css`
                  position: absolute;
                  opacity: 1;
                `}
                {...restProps} // iconType을 제외한 나머지 props 전달
                name={props.icon}
                size={25}
                color="#00D282"
                z-index="1"
              />
            )}
            {iconType === 'MaterialIcons' && ( // 아이콘 타입에 따라 조건부 렌더링
              <MaterialIcons
                style={css`
                  position: absolute;
                `}
                {...restProps} // iconType을 제외한 나머지 props 전달
                name={props.icon}
                size={25}
                color="#00D282"
              />
            )}
            {iconType === 'FontAwesome6' && ( // 아이콘 타입에 따라 조건부 렌더링
              <FontAwesome6
                style={css`
                  position: absolute;
                `}
                {...restProps} // iconType을 제외한 나머지 props 전달
                name={props.icon}
                size={25}
                color="#00D282"
              />
            )}
            {iconType === 'MaterialCommunityIcons' && ( // 아이콘 타입에 따라 조건부 렌더링
              <MaterialCommunityIcons
                style={css`
                  position: absolute;
                `}
                {...restProps} // iconType을 제외한 나머지 props 전달
                name={props.icon}
                size={25}
                color="#00D282"
              />
            )}
          </IconBackground>
          <Text
            style={css`
              font-size: 15px;
              font-weight: 500;
            `}
            {...props}>
            {props.title}
          </Text>
        </View>

        <Text>
          <Ant name="right" size={20} color="black" />
        </Text>
      </View>
    </InnerContainerBoxhorizontal>
  );
};
export default Mypagelist;
