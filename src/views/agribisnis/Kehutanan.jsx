import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import LuasHutanCard from './kehutanan-component/LuasHutanCard';
import ProduksiKayuHutanCard from './kehutanan-component/ProduksiKayuHutan';
import BarLuasHutanCard from './kehutanan-component/BarLuasHutanCard';
import DonutLuasHutanCard from './kehutanan-component/DonutLuasHutanCard';
import StackedProduksiKayuCard from './kehutanan-component/StackedProduksiKayuCard';

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

export default function Pendidikan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 5.4.1 KDA
  const [json541, setJson541] = useState([]);
  // json untuk 5.4.2 KDA
  const [json542, setJson542] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 5.4.1 KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.4.1%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson541(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);
      });
  }, []);

  // Ambil data 5.4.2 KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.4.2%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson542(jsonData));
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
          Statistik Kehutanan di Kabupaten Sumba Barat, {tahun}
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
          <Grid item xs={12} md={6} lg={6}>
            <LuasHutanCard isLoading={isLoading} data={json541} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ProduksiKayuHutanCard isLoading={isLoading} data={json542} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <BarLuasHutanCard isLoading={isLoading} data={json541} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DonutLuasHutanCard isLoading={isLoading} data={json541} tahun={tahun} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <StackedProduksiKayuCard isLoading={isLoading} data={json542} tahun={tahun} />
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahGuruNegeriCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahGuruSwasta isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            {/* <DonutGuruCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            {/* <StackedGuruCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahMuridCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahMuridNegeriCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahMuridSwastaCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            {/* <DonutMuridCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            {/* <StackedMuridCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
