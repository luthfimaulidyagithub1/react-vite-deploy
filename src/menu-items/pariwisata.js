// assets
import { IconPlane, IconCar, IconPhone } from '@tabler/icons-react';

const icons = { IconPlane, IconCar, IconPhone };

const pariwisata = {
  id: 'pariwisata',
  title: 'Sektor Tersier',
  caption: 'Pariwisata, Transportasi & Komunikasi',
  type: 'group',
  children: [
    {
      id: 'pariwisata-collapse',
      title: 'Sektor Tersier',
      type: 'collapse',
      icon: icons.IconPlane,
      children: [
        { id: 'pariwisata-item', title: 'Pariwisata', type: 'item', url: '/statistik/pariwisata', icon: icons.IconPlane },
        { id: 'transportasi', title: 'Transportasi', type: 'item', url: '/statistik/transportasi', icon: icons.IconCar },
        { id: 'komunikasi', title: 'Komunikasi', type: 'item', url: '/statistik/komunikasi', icon: icons.IconPhone }
      ]
    }
  ]
};

export default pariwisata;
