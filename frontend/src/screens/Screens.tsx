import MySetting from '@screens/MySetting';
import Signup0 from '@/screens/Signup/Signup0';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup5a from '@/screens/Signup/Signup5a';
import Signup6 from '@/screens/Signup/Signup6';

type ScreenItem = {
  name: string;
  component: React.ComponentType<any>;
};

export const Screens: ScreenItem[] = [
  {name: 'Signup0', component: Signup0},
  {name: 'Signup1', component: Signup1},
  {name: 'Signup2', component: Signup2},
  {name: 'Signup3', component: Signup3},
  {name: 'Signup4', component: Signup4},
  {name: 'Signup5', component: Signup5},
  {name: 'Signup5a', component: Signup5a},
  {name: 'Signup6', component: Signup6},
  {name: 'MySetting', component: MySetting},
];
