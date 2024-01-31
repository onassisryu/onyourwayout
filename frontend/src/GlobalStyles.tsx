import styled from '@emotion/native';
import theme from '@/Theme';

export const GlobalContainer = styled.View`
  font-family: ${theme.font.primary};
  font-size: ${theme.fontSize.medium};
  align-items: center;
  margin: 0;
  padding: 0;
  color: ${theme.color.black};
  box-sizing: border-box;
  background-color: white;
  height: 100%;
`;

export const GlobalText = styled.Text`
  font-family: ${theme.font.primary};
  font-size: ${theme.fontSize.medium};
  justify-content: center;
  align-items: center;
  color: ${theme.color.black};
`;

export const GlobalButton = styled.TouchableOpacity`
  font-family: ${theme.font.primary};
  font-size: ${theme.fontSize.medium};
  cursor: pointer;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  color: ${theme.color.black};
  background-color: ${theme.color.gray100};
`;
