// assets
import { IconBuildingFactory } from '@tabler/icons-react';

const icons = { IconBuildingFactory };

const industri = {
  id: 'industri',
  title: 'Industri',
  caption: 'Industri, Tambang & Energi',
  type: 'group',
  children: [
    {
      id: 'industri-item',
      title: 'Energi',
      type: 'item',
      url: '/statistik/industri',
      icon: icons.IconBuildingFactory
    }
  ]
};

export default industri;
