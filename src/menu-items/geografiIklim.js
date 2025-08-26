// assets
import { IconWorld } from '@tabler/icons-react';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

const icons = { IconWorld, CloudOutlinedIcon };

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
          url: '/statistik/geografi'
        },
        {
          id: 'iklim',
          title: 'Iklim',
          type: 'item',
          url: '/statistik/iklim'
        }
      ]
    }
  ]
};

export default geografiIklim;
