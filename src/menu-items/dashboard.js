// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Beranda',
      type: 'item',
      url: '/beranda/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
    // {
    //   id: 'beranda',
    //   title: 'Beranda',
    //   type: 'item',
    //   url: '/beranda',
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false
    // }
  ]
};

export default dashboard;
