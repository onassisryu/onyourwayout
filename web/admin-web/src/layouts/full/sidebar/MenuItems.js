import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Deal',
  },

  {
    id: uniqueId(),
    title: '신고 거래',
    icon: IconLayoutDashboard,
    href: '/deal/complain',
  },
  {
    navlabel: true,
    subheader: 'Member',
  },
  {
    id: uniqueId(),
    title: '정지 사용자',
    icon: IconTypography,
    href: '/member/paused',
  },
  {
    id: uniqueId(),
    title: '비인증 사용자',
    icon: IconCopy,
    href: '/member/noncerti',
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Login',
    icon: IconLogin,
    href: '/auth/login',
  }
];

export default Menuitems;
