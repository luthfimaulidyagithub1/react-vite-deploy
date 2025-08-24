import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import PieAngkatanKerjaCard from './kerja-component/PieAngkatanKerjaCard';
import PieAKCard from './kerja-component/PieAKCard';
import PieBAKCard from './kerja-component/PieBAKCard';
import BarKegiatanJKCard from './kerja-component/BarKegiatanJKCard';
import StackedAKCard from './kerja-component/StackedAKCard';
import StackedPUKCard from './kerja-component/StackedPUKCard';
import BarKegiatanJKHorizontalCard from './kerja-component/BarKegiatanJKHorizontalCard';
import DonutStatusPekerjaanCard from './kerja-component/DonutStatusPekerjaanCard';

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

export default function Ketenagakerjaan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 3.2.1 KDA
  const [json321, setJson321] = useState([]);
  // json untuk 3.2.2 KDA
  const [json322, setJson322] = useState([]);
  // json untuk 3.2.3 KDA
  const [json323, setJson323] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [mapStyle, setMapStyle] = useState('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json');
  const [sumberData, setSumberData] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 3.2.1 KDA JSON
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/3.2.1%20KDA.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson321(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);
      });
  }, []);

  // Ambil data 3.2.2 KDA
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/3.2.2%20KDA.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson322(jsonData));
  }, []);

  // Ambil data 3.2.3 KDA
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/3.2.3%20KDA.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson323(jsonData));
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
          Keadaan Ketenagakerjaan di Kabupaten Sumba Barat, {tahun}
        </Typography>
      }
    >
      <CardContent>
        {/* Filter Tahun & Kecamatan */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
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
          <Grid item xs={12} md={6} lg={4}>
            <PieAngkatanKerjaCard isLoading={isLoading} data={json321} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieAKCard isLoading={isLoading} data={json321} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieBAKCard isLoading={isLoading} data={json321} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={12}>
            <BarKegiatanJKCard isLoading={isLoading} data={json321} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <StackedPUKCard isLoading={isLoading} data={json322} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <StackedAKCard isLoading={isLoading} data={json322} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <BarKegiatanJKHorizontalCard isLoading={isLoading} data={json323} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DonutStatusPekerjaanCard isLoading={isLoading} data={json323} tahun={tahun} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
