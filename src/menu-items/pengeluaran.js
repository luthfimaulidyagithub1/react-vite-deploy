// assets
import { IconWallet } from '@tabler/icons-react';

const icons = { IconWallet };

const pengeluaran = {
  id: 'pengeluaran',
  title: 'Pengeluaran Penduduk',
  type: 'group',
  children: [{ id: 'pengeluaran-item', title: 'Pengeluaran', type: 'item', url: '/statistik/pengeluaran', icon: icons.IconWallet }]
};

export default pengeluaran;
