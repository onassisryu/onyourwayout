import Activity from '@/screens/My/Activity';
import ApartCertification from '@/screens/My/ApartCertification';
import BankAccount from '@/screens/My/BankAccount';
import InvitationCode from '@/screens/My/InvitationCode';
import ServiceCenter from '@/screens/My/ServiceCenter';

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
];
