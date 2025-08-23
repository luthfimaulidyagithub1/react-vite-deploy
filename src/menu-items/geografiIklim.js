// assets
import { IconWorld } from '@tabler/icons-react';

const icons = { IconWorld };

const geografiIklim = {
  id: 'geografi-iklim',
  title: 'Geografi & Iklim',
  type: 'group', // <- pakai group di level utama
  children: [
    {
      id: 'geografi-iklim-collapse',
      title: 'Geografi & Iklim',
      type: 'collapse',
      icon: icons.IconWorld,
      children: [
        {
          id: 'geografi',
          title: 'Geografi',
          type: 'item',
          url: '/statistik/geografi',
          icon: icons.IconWorld,
          breadcrumbs: false
        },
        {
          id: 'iklim',
          title: 'Iklim',
          type: 'item',
          url: '/statistik/iklim',
          icon: icons.IconWorld,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default geografiIklim;
