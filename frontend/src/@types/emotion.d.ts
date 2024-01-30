import '@emotion/react';
import {ColorsTypes, FontSizeTypes, BordersTypes, FontsTypes} from '@/Theme';

declare module '@emotion/react' {
  export interface Theme {
    color: ColorsTypes;
    font: FontsTypes;
    fontSize: FontSizeTypes;
    border: BordersTypes;
  }
}
