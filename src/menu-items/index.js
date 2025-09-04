import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
// import statistik from './statistik';
import geografiIklim from './geografiIklim';
import pemerintahan from './pemerintahan';
import pendudukKerja from './pendudukKerja';
import sosial from './sosial';
import pertanian from './pertanian';
import industri from './industri';
import pariwisata from './pariwisata';
import perdagangan from './perdagangan';
import pengeluaran from './pengeluaran';
import neraca from './neraca';
import perbandingan from './perbandingan';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    geografiIklim,
    pemerintahan,
    pendudukKerja,
    sosial,
    pertanian,
    industri,
    pariwisata,
    perdagangan,
    pengeluaran,
    neraca,
    perbandingan
    // pages,
    // utilities
  ]
};

export default menuItems;
