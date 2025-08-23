// assets
import { IconBuilding } from '@tabler/icons-react';

const icons = { IconBuilding };

const pemerintahan = {
  id: 'pemerintahan',
  title: 'Pemerintahan',
  type: 'group',
  children: [
    {
      id: 'pemerintahan-item',
      title: 'Pemerintahan',
      type: 'item',
      url: '/statistik/pemerintahan',
      icon: icons.IconBuilding,
      breadcrumbs: false
    }
  ]
};

export default pemerintahan;
