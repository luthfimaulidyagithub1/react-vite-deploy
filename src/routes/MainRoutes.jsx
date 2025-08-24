import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { constant } from 'lodash-es';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Beranda = Loadable(lazy(() => import('views/dashboard/Default/Beranda')));

// geografi routing
const Geografi = Loadable(lazy(() => import('views/geografi/Geografi')));
const Iklim = Loadable(lazy(() => import('views/geografi/Iklim')));

// pemerintahan routing
const Pemerintahan = Loadable(lazy(() => import('views/pemerintahan')));

// penduduk routing
const Penduduk = Loadable(lazy(() => import('views/penduduk/Penduduk')));
const Ketenagakerjaan = Loadable(lazy(() => import('views/penduduk/Ketenagakerjaan')));

// sosial routing
const Pendidikan = Loadable(lazy(() => import('views/sosial/Pendidikan')));
const AgamaDll = Loadable(lazy(() => import('views/sosial/AgamaDll')));
const Perumahan = Loadable(lazy(() => import('views/sosial/Perumahan')));
const Kemiskinan = Loadable(lazy(() => import('views/sosial/Kemiskinan')));
const BencanaAlam = Loadable(lazy(() => import('views/sosial/BencanaAlam')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'beranda',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    // {
    //   path: 'beranda',
    //   element: <Beranda />
    // },
    {
      path: 'statistik/geografi',
      element: <Geografi />
    },
    {
      path: 'statistik/iklim',
      element: <Iklim />
    },
    {
      path: 'statistik/pemerintahan',
      element: <Pemerintahan />
    },
    {
      path: 'statistik/penduduk',
      element: <Penduduk />
    },
    {
      path: 'statistik/ketenagakerjaan',
      element: <Ketenagakerjaan />
    },
    {
      path: 'statistik/pendidikan',
      element: <Pendidikan />
    },
    {
      path: 'statistik/agama-dll',
      element: <AgamaDll />
    },
    {
      path: 'statistik/perumahan',
      element: <Perumahan />
    },
    {
      path: 'statistik/kemiskinan',
      element: <Kemiskinan />
    },
    {
      path: 'statistik/bencana',
      element: <BencanaAlam />
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
