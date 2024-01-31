import {GlobalText, GlobalButton} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import {Global, useTheme} from '@emotion/react';

type Color = 'primary' | 'white' | 'gray';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  color: Color;
  size?: Size;
  onPress?: () => void;
}

const StyledText = styled(GlobalText)<{size?: Size; color?: Color}>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm':
        return '15px';
      case 'md':
        return '18px';
      case 'lg':
        return '22px';
      default:
        return '25px';
    }
  }};
  font-weight: bold;
  color: ${props => {
    switch (props.color) {
      case 'primary':
        return '#ffff';
      case 'white':
        return useTheme().color.gray100;
      case 'gray':
        return '#ffff';
      default:
        return '#ffff';
    }
  }};
`;

const StledButton = styled(GlobalButton)`
  /* shadow-opacity: 0.25px;
  shadow-color: '#000';
  shadow-offset: {
    width: 0px;
    height: 2px;
  }
  shadow-radius: '3.84';
  elevation: '5'; */
`;
const DefaultButton = (props: ButtonProps) => {
  const theme = useTheme();

  let colorStyle;
  let sizeStyle;
  switch (props.size) {
    case 'sm':
      sizeStyle = css`
        padding: 5px;
      `;
      break;
    case 'md':
      sizeStyle = css`
        min-width: 100px;
        min-height: 40px;
        padding: 10px 20px;
      `;
      break;
    case 'lg':
      sizeStyle = css`
        width: 100%;
        height: 60px;
        padding: 10px;
      `;
      break;
    default:
      sizeStyle = css`
        padding: 10px;
      `;
  }
  switch (props.color) {
    case 'primary':
      colorStyle = css`
        background-color: ${theme.color.primary};
      `;
      break;
    case 'white':
      colorStyle = css`
        background-color: #ffff;
        border: 1px solid ${theme.color.primary};
      `;
      break;
    case 'gray':
      colorStyle = css`
        background-color: ${theme.color.gray100};
      `;
      break;
    default:
      // Default to primary color if the provided color is not recognized
      colorStyle = css`
        background-color: ${theme.color.primary};
      `;
  }
  return (
    <StledButton style={[colorStyle, sizeStyle]} onPress={props.onPress}>
      <StyledText size={props.size} color={props.color}>
        {props.title}
      </StyledText>
    </StledButton>
  );
};

export default DefaultButton;
