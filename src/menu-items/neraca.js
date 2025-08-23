// assets
import { IconChartPie } from '@tabler/icons-react';

const icons = { IconChartPie };

const neraca = {
  id: 'neraca',
  title: 'Sistem Neraca Regional',
  type: 'group',
  children: [{ id: 'neraca-item', title: 'Neraca Regional', type: 'item', url: '/statistik/neraca', icon: icons.IconChartPie }]
};

export default neraca;
