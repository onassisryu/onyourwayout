import MySetting from '@screens/MySetting';
import Login from '@screens/Login';
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';
import DoIt1 from '@/screens/DoIt/DoIt1';
import DoIt2 from '@/screens/DoIt/DoIt2';
import Signup0 from '@/screens/Signup/Signup0';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup5a from '@/screens/Signup/Signup5a';
import Signup6 from '@/screens/Signup/Signup6';
import GoOut1 from '@/screens/GoOut/GoOut1';
import GoOut2 from '@/screens/GoOut/GoOut2';
import Activity from '@/screens/My/Activity';
import ApartCertification from '@/screens/My/ApartCertification';
import BankAccount from '@/screens/My/BankAccount';
import InvitationCode from '@/screens/My/InvitationCode';
import ServiceCenter from '@/screens/My/ServiceCenter';
import DoItList from './DoItList';
import DoItListDetail from './DoItListDetail';
import MyDoList from './My/MyDoList';
type ScreenItem = {
  name: string;
  component: React.ComponentType<any>;
};

export const Screens: ScreenItem[] = [
  {name: 'Activity', component: Activity},
  {name: 'ApartCertification', component: ApartCertification},
  {name: 'BankAccount', component: BankAccount},
  {name: 'InvitationCode', component: InvitationCode},
  {name: 'ServiceCenter', component: ServiceCenter},
  {name: 'DoItList', component: DoItList},
  {name: 'DoItListDetail', component: DoItListDetail},
  {name: 'Login', component: Login},
  {name: 'Notice', component: Notice},
  {name: 'NoticeSettings', component: NoticeSettings},
  {name: 'GoOut1', component: GoOut1},
  {name: 'GoOut2', component: GoOut2},
  {name: 'DoIt1', component: DoIt1},
  {name: 'DoIt2', component: DoIt2},
  {name: 'Signup0', component: Signup0},
  {name: 'Signup1', component: Signup1},
  {name: 'Signup2', component: Signup2},
  {name: 'Signup3', component: Signup3},
  {name: 'Signup4', component: Signup4},
  {name: 'Signup5', component: Signup5},
  {name: 'Signup5a', component: Signup5a},
  {name: 'Signup6', component: Signup6},
  {name: 'MySetting', component: MySetting},
  {name: 'MyDoList', component: MyDoList},
];
