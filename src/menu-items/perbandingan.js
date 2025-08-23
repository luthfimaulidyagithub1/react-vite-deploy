// assets
import { IconArrowsSort } from '@tabler/icons-react';

const icons = { IconArrowsSort };

const perbandingan = {
  id: 'perbandingan',
  title: 'Perbandingan Antarkabupaten',
  type: 'group',
  children: [
    {
      id: 'perbandingan-item',
      title: 'Perbandingan',
      type: 'item',
      url: '/statistik/perbandingan',
      icon: icons.IconArrowsSort
    }
  ]
};

export default perbandingan;
