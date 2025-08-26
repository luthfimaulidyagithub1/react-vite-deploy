// assets
import { IconLeaf } from '@tabler/icons-react';

const icons = { IconLeaf };

const pertanian = {
  id: 'pertanian',
  title: 'Sektor Agribisnis',
  caption: 'Pertanian, Peternakan, Perikanan, dll',
  type: 'group',
  children: [
    {
      id: 'pertanian-collapse',
      title: 'Agribisnis',
      type: 'collapse',
      icon: icons.IconLeaf,
      children: [
        { id: 'hortikultura', title: 'Hortikultura', type: 'item', url: '/statistik/hortikultura' },
        { id: 'perkebunan', title: 'Perkebunan', type: 'item', url: '/statistik/perkebunan' },
        { id: 'pertanian-item', title: 'Pertanian', type: 'item', url: '/statistik/pertanian' },
        { id: 'kehutanan', title: 'Kehutanan', type: 'item', url: '/statistik/kehutanan' },
        { id: 'peternakan', title: 'Peternakan', type: 'item', url: '/statistik/peternakan' },
        { id: 'perikanan', title: 'Perikanan', type: 'item', url: '/statistik/perikanan' }
      ]
    }
  ]
};

export default pertanian;
