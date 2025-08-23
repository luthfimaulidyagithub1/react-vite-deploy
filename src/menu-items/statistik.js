// assets
import {
  IconWorld,
  IconBuilding,
  IconUsers,
  IconSchool,
  IconHeart,
  IconHome,
  IconAlertTriangle,
  IconPlant2,
  IconBuildingFactory,
  IconCar,
  IconPhone,
  IconShoppingCart,
  IconCreditCard,
  IconCurrencyDollar,
  IconChartBar
} from '@tabler/icons-react';

// constant
const icons = {
  IconWorld,
  IconBuilding,
  IconUsers,
  IconSchool,
  IconHeart,
  IconHome,
  IconAlertTriangle,
  IconPlant2,
  IconBuildingFactory,
  IconCar,
  IconPhone,
  IconShoppingCart,
  IconCreditCard,
  IconCurrencyDollar,
  IconChartBar
};

// ==============================|| STATISTIK MENU ITEMS ||============================== //

const statistik = {
  id: 'statistik',
  title: 'Statistik',
  caption: 'Data Statistik Daerah',
  type: 'group',
  children: [
    {
      id: 'geografi-iklim',
      title: 'Geografi & Iklim',
      type: 'collapse',
      icon: icons.IconWorld,
      children: [
        { id: 'geografi', title: 'Geografi', type: 'item', url: '/statistik/geografi', icon: icons.IconWorld },
        { id: 'iklim', title: 'Iklim', type: 'item', url: '/statistik/iklim', icon: icons.IconWorld }
      ]
    },
    {
      id: 'pemerintahan',
      title: 'Pemerintahan',
      type: 'item',
      url: '/statistik/pemerintahan',
      icon: icons.IconBuilding
    },
    {
      id: 'penduduk-kerja',
      title: 'Penduduk & Ketenagakerjaan',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        { id: 'penduduk', title: 'Penduduk', type: 'item', url: '/statistik/penduduk', icon: icons.IconUsers },
        { id: 'ketenagakerjaan', title: 'Ketenagakerjaan', type: 'item', url: '/statistik/ketenagakerjaan', icon: icons.IconUsers }
      ]
    },
    {
      id: 'sosial',
      title: 'Sosial & Kesejahteraan',
      type: 'collapse',
      icon: icons.IconHeart,
      children: [
        { id: 'pendidikan', title: 'Pendidikan', type: 'item', url: '/statistik/pendidikan', icon: icons.IconSchool },
        {
          id: 'agama-kesehatan',
          title: 'Agama, Kesehatan & Olahraga',
          type: 'item',
          url: '/statistik/agama-kesehatan',
          icon: icons.IconHeart
        },
        { id: 'perumahan', title: 'Perumahan & Lingkungan', type: 'item', url: '/statistik/perumahan', icon: icons.IconHome },
        { id: 'kemiskinan', title: 'Kemiskinan', type: 'item', url: '/statistik/kemiskinan', icon: icons.IconAlertTriangle },
        { id: 'bencana', title: 'Bencana Alam', type: 'item', url: '/statistik/bencana', icon: icons.IconAlertTriangle }
      ]
    },
    {
      id: 'pertanian',
      title: 'Pertanian',
      type: 'collapse',
      icon: icons.IconPlant2,
      children: [
        { id: 'hortikultura', title: 'Hortikultura', type: 'item', url: '/statistik/hortikultura', icon: icons.IconPlant2 },
        { id: 'perkebunan', title: 'Perkebunan', type: 'item', url: '/statistik/perkebunan', icon: icons.IconPlant2 },
        { id: 'pertanian', title: 'Pertanian', type: 'item', url: '/statistik/pertanian', icon: icons.IconPlant2 },
        { id: 'kehutanan', title: 'Kehutanan', type: 'item', url: '/statistik/kehutanan', icon: icons.IconPlant2 },
        { id: 'peternakan', title: 'Peternakan', type: 'item', url: '/statistik/peternakan', icon: icons.IconPlant2 },
        { id: 'perikanan', title: 'Perikanan', type: 'item', url: '/statistik/perikanan', icon: icons.IconPlant2 }
      ]
    },
    {
      id: 'industri',
      title: 'Industri, Tambang & Energi',
      type: 'item',
      url: '/statistik/industri',
      icon: icons.IconBuildingFactory
    },
    {
      id: 'pariwisata',
      title: 'Pariwisata, Transportasi & Komunikasi',
      type: 'collapse',
      icon: icons.IconCar,
      children: [
        { id: 'pariwisata', title: 'Pariwisata', type: 'item', url: '/statistik/pariwisata', icon: icons.IconCar },
        { id: 'transportasi', title: 'Transportasi', type: 'item', url: '/statistik/transportasi', icon: icons.IconCar },
        { id: 'komunikasi', title: 'Komunikasi', type: 'item', url: '/statistik/komunikasi', icon: icons.IconPhone }
      ]
    },
    {
      id: 'perdagangan',
      title: 'Perbankan, Koperasi & Perdagangan',
      type: 'collapse',
      icon: icons.IconShoppingCart,
      children: [
        { id: 'lembaga-keuangan', title: 'Lembaga Keuangan', type: 'item', url: '/statistik/lembaga-keuangan', icon: icons.IconCreditCard },
        { id: 'perdagangan', title: 'Perdagangan', type: 'item', url: '/statistik/perdagangan', icon: icons.IconCurrencyDollar }
      ]
    },
    {
      id: 'pengeluaran',
      title: 'Pengeluaran Penduduk',
      type: 'item',
      url: '/statistik/pengeluaran',
      icon: icons.IconCurrencyDollar
    },
    {
      id: 'neraca',
      title: 'Sistem Neraca Regional',
      type: 'item',
      url: '/statistik/neraca',
      icon: icons.IconChartBar
    },
    {
      id: 'perbandingan',
      title: 'Perbandingan Antarkabupaten',
      type: 'item',
      url: '/statistik/perbandingan',
      icon: icons.IconChartBar
    }
  ]
};

export default statistik;
