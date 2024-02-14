import {Text} from 'react-native';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
interface Headtext {
  title: string;
}

const StyledText = styled(Text)`
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.color.black};
`;

const SignupHeadtext = (props: Headtext) => {
  return <StyledText {...props}>{props.title}</StyledText>;
};

export default SignupHeadtext;
