import '@emotion/react';
import {ColorsTypes, FontSizeTypes, BordersTypes} from '@/Theme';

declare module '@emotion/react' {
  export interface Theme {
    color: ColorsTypes;
    fontSize: FontSizeTypes;
    border: BordersTypes;
  }
}
