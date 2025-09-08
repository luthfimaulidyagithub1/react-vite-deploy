import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography'; // <-- Tambahkan ini
import { Box } from '@mui/material'; // <-- Tambahkan ini jika diperlukan untuk layout

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import Beranda from './Beranda'; // <-- import Beranda
import PopulationCard from './PopulationCard';
import KKCard from './KKCard';
import MalePopulationCard from './MalePopulationCard';
import FemalePopulationCard from './FemalePopulationCard';
import PopulationDensityCard from './PopulationDensityCard';
import GenderRatioCard from './GenderRatioCard';
import TotalAreaCard from './TotalAreaCard';
import PetaPendudukDesaCard from './PetaPendudukDesaCard';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      {/* Tambahkan judul di sini */}
      <Grid size={12}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Statistik Kependudukan Kabupaten Sumba Barat
          </Typography>
        </Box>
      </Grid>
      {/* Bagian card atas */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 8, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                <PopulationCard isLoading={isLoading} />
              </Grid>
              {/* <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
                <EarningCard isLoading={isLoading} />
              </Grid> */}
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                <KKCard isLoading={isLoading} />
                {/* <TotalOrderLineChartCard isLoading={isLoading} /> */}
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing} sx={{ mt: 2 }}>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                <MalePopulationCard isLoading={isLoading} />
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
                <FemalePopulationCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 4, xs: 12, md: 4, lg: 12 }}>
                <PopulationDensityCard isLoading={isLoading} />
              </Grid>
              <Grid size={{ sm: 4, xs: 12, md: 4, lg: 12 }}>
                <GenderRatioCard isLoading={isLoading} />
              </Grid>
              <Grid size={{ sm: 4, xs: 12, md: 4, lg: 12 }}>
                <TotalAreaCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Panggil komponen Beranda */}
      <Grid size={12}>
        <PetaPendudukDesaCard isLoading={isLoading} />
      </Grid>
    </Grid>
  );
}
