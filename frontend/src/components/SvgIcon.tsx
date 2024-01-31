import React from 'react';
import {SvgProps} from 'react-native-svg';

// 직전에 만들었던 아이콘 관리 파일에서 import
import * as Icons from '~/icons';

type IconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
  onPress?: () => void;
};
function SvgIcon({name, size, onPress}: IconProps) {
  const SvgIcon = Icons[name];

  const width = size;
  const height = size;

  const sizeProps = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  return <SvgIcon {...sizeProps} onPress={onPress} />;
}

export default SvgIcon;
