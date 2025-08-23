// assets
import { IconUsers } from '@tabler/icons-react';

const icons = { IconUsers };

const pendudukKerja = {
  id: 'penduduk-kerja',
  title: 'Penduduk & Ketenagakerjaan',
  type: 'group',
  children: [
    {
      id: 'penduduk',
      title: 'Penduduk',
      type: 'item',
      url: '/statistik/penduduk',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'ketenagakerjaan',
      title: 'Ketenagakerjaan',
      type: 'item',
      url: '/statistik/ketenagakerjaan',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default pendudukKerja;
