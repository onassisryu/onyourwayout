import styled, {css} from '@emotion/native';
import {useTheme} from '@emotion/react';
import DefaultButton from '@/components/DefaultButton';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';

const StyledText = styled(GlobalText)`
  font-size: 30px;
`;

const Home = () => {
  const theme = useTheme();
  return (
    <GlobalContainer>
      <StyledText
        style={css`
          background-color: ${theme.color.primary};
        `}>
        Home
      </StyledText>
      <GlobalButton>
        <GlobalText>go to the chat screen</GlobalText>
      </GlobalButton>
      <DefaultButton title="수락하기" color="primary" size="md" />
      <DefaultButton title="수락하기" color="primary" size="lg" />
    </GlobalContainer>
  );
};

export default Home;
