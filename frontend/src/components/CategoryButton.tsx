import {GlobalButton, GlobalText} from '@/GlobalStyles';
import styled from '@emotion/native';

const Category = styled(GlobalButton)<{selected: boolean}>`
  max-width: 200px;
  padding: 9px;
  border-radius: 15px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${props => props.theme.fontSize.small};
  font-weight: bold;
  padding-right: 10px;
  padding-left: 10px;
  color: ${({selected, theme}) => (selected ? theme.color.primary : theme.color.gray)};
`;

const CategoryButton = ({selected, text}: {selected: boolean; text: string}) => {
  return (
    <Category selected={selected}>
      <CategoryText selected={selected}>{text}</CategoryText>
    </Category>
  );
};

// const CategoryButton = ({selected, text, onPress}: {selected: boolean; text: string; onPress: () => void}) => {
//     return (
//       <Category selected={selected} onPress={onPress}>
//         <CategoryText selected={selected}>{text}</CategoryText>
//       </Category>
//     );

//   };

export default CategoryButton;
