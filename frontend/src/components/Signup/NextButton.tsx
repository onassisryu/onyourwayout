import DefaultButton from '../DefaultButton';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
const NextButton = styled(DefaultButton)`
  width: 100%;
  font-size: 18px;
  height: 60px;
  margin-top: 20px;
  background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
`;

export default NextButton;
