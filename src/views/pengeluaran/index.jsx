import React, { useEffect, useState, useRef } from 'react';

// material-ui
import {
  Grid,
  Box,
  CardContent,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import StackedPengeluaranCard from './pengeluaran-component/StackedPengeluaranCard';
import PengeluaranBukanBukanMakananBarLineCard from './pengeluaran-component/PengeluaranBukanMakananBarLineCard';
import RataRataMakananCard from './pengeluaran-component/RataRataMakananCard';
import RataRataBukanMakananCard from './pengeluaran-component/RataRataBukanMakananCard';
import BarPengeluaranMakananCard from './pengeluaran-component/BarPengeluaranMakananCard';
import BarPengeluaranBukanMakananCard from './pengeluaran-component/BarPengeluaranBukanMakananCard';
import PiePengeluaranGolonganCard from './pengeluaran-component/PiePengeluaranGolonganCard';

// icons
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import DarkModeIcon from '@mui/icons-material/DarkMode';

// map & chart
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
  ReferenceLine
} from 'recharts';

export default function Perdagangan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 10.1-10.2 KDA
  const [json101, setJson101] = useState([]);
  // json untuk 10.3 KDA
  const [json103, setJson103] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 10.1-10.2 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/10.1-10.2%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson101(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);
      });
  }, []);

  // Ambil data 10.3 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/10.3%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson103(jsonData));
  }, []);

  return (
    <MainCard
      content={false}
      title={
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold', // bikin bold
            color: (theme) => theme.palette.grey[900]
          }}
        >
          Statistik Pengeluaran Penduduk Kabupaten Sumba Barat
        </Typography>
      }
    >
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <StackedPengeluaranCard isLoading={isLoading} data={json101} />
          </Grid>
        </Grid>
        {/* Garis pembatas */}
        <Divider sx={{ my: 1 }} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold', // bikin bold
            color: (theme) => theme.palette.grey[900],
            mt: 3,
            mb: 2,
            textAlign: 'center'
          }}
        >
          Statistik Pengeluaran Penduduk Kabupaten Sumba Barat Tahun {tahun}
        </Typography>
        {/* Filter Tahun */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>
                Tahun
              </Typography>
              <Select value={tahun} onChange={(e) => setTahun(e.target.value)} sx={{ borderRadius: 3, fontWeight: 'bold', height: 40 }}>
                {tahunList.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <RataRataMakananCard isLoading={isLoading} data={json101} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <RataRataBukanMakananCard isLoading={isLoading} data={json101} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <BarPengeluaranMakananCard isLoading={isLoading} data={json101} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <BarPengeluaranBukanMakananCard isLoading={isLoading} data={json101} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <PiePengeluaranGolonganCard isLoading={isLoading} data={json103} tahun={tahun} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
