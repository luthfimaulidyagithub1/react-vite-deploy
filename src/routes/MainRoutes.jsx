import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { constant } from 'lodash-es';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Beranda = Loadable(lazy(() => import('views/dashboard/Default/Beranda')));
const Landing = Loadable(lazy(() => import('views/dashboard/Default/Landing')));

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
const Kesehatan = Loadable(lazy(() => import('views/sosial/Kesehatan')));
const AgamaOR = Loadable(lazy(() => import('views/sosial/AgamaOR')));
const Perumahan = Loadable(lazy(() => import('views/sosial/Perumahan')));
const Kemiskinan = Loadable(lazy(() => import('views/sosial/Kemiskinan')));
const BencanaAlam = Loadable(lazy(() => import('views/sosial/BencanaAlam')));

// agribisnis routing
const Pertanian = Loadable(lazy(() => import('views/agribisnis/Pertanian')));
const Peternakan = Loadable(lazy(() => import('views/agribisnis/Peternakan')));
const Perkebunan = Loadable(lazy(() => import('views/agribisnis/Perkebunan')));
const Hortikultura = Loadable(lazy(() => import('views/agribisnis/Hortikultura')));
const Perikanan = Loadable(lazy(() => import('views/agribisnis/Perikanan')));
const Kehutanan = Loadable(lazy(() => import('views/agribisnis/Kehutanan')));

// industri routing
const Energi = Loadable(lazy(() => import('views/industri')));

// pariwisata routing
const Pariwisata = Loadable(lazy(() => import('views/pariwisata/Pariwisata')));
const Komunikasi = Loadable(lazy(() => import('views/pariwisata/Komunikasi')));
const Transportasi = Loadable(lazy(() => import('views/pariwisata/Transportasi')));

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
      element: <Landing />
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
      path: 'statistik/kesehatan',
      element: <Kesehatan />
    },
    {
      path: 'statistik/agama-or',
      element: <AgamaOR />
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
      path: 'statistik/pertanian',
      element: <Pertanian />
    },
    {
      path: 'statistik/peternakan',
      element: <Peternakan />
    },
    {
      path: 'statistik/perkebunan',
      element: <Perkebunan />
    },
    {
      path: 'statistik/hortikultura',
      element: <Hortikultura />
    },
    {
      path: 'statistik/perikanan',
      element: <Perikanan />
    },
    {
      path: 'statistik/kehutanan',
      element: <Kehutanan />
    },
    {
      path: 'statistik/energi',
      element: <Energi />
    },
    {
      path: 'statistik/pariwisata',
      element: <Pariwisata />
    },
    {
      path: 'statistik/transportasi',
      element: <Transportasi />
    },
    {
      path: 'statistik/komunikasi',
      element: <Komunikasi />
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
