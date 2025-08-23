// assets
import { IconShoppingCart, IconCurrencyDollar } from '@tabler/icons-react';

const icons = { IconShoppingCart, IconCurrencyDollar };

const perdagangan = {
  id: 'perdagangan',
  title: 'Keuangan & Perdagangan',
  caption: 'Perbankan, Koperasi & Perdagangan',
  type: 'group',
  children: [
    { id: 'keuangan', title: 'Keuangan', type: 'item', url: '/statistik/keuangan', icon: icons.IconShoppingCart },
    { id: 'perdagangan-item', title: 'Perdagangan', type: 'item', url: '/statistik/perdagangan', icon: icons.IconCurrencyDollar }
  ]
};

export default perdagangan;
