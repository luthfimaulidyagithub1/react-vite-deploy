import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import TransportasiTerbanyakCard from './transportasi-component/TransportasiTerbanyakCard';
import PermukaanJalanCard from './transportasi-component/PermukaanJalanCard';
import KondisiJalanCard from './transportasi-component/KondisiJalanCard';
import PieSaranaTransportasiCard from './transportasi-component/PieSaranaTransportasiCard';
import PieAngkutanCard from './transportasi-component/PieAngkutanCard';
import PieJalanTerluasCard from './transportasi-component/PieJalanTerluasCard';
import PieDilaluiKendaraanCard from './transportasi-component/PieDilauiKendaraanCard';
import StackedPanjangJalanCard from './transportasi-component/StackedPanjangJalanCard';
import StackedKondisiJalanCard from './transportasi-component/StackedKondisiJalanCard';

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

export default function Transportasi() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 6.2.1
  const [json621, setJson621] = useState([]);
  // json untuk 6.2.3
  const [json623, setJson623] = useState([]);
  // json untuk 6.2.4
  const [json624, setJson624] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 6.1.1 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/6.2.1.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson621(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);

        // isi kecamatanList
        const kecamatanUnik = [...new Set(jsonData.map((d) => d.kecamatan))].sort();
        setKecamatanList(kecamatanUnik);

        // ✅ set default ke "Kota Waikabubak" kalau ada di list
        if (kecamatanUnik.includes('Kota Waikabubak')) {
          setSelectedKecamatan('Kota Waikabubak');
        } else {
          setSelectedKecamatan(kecamatanUnik[0]); // fallback ke pertama
        }
      });
  }, []);

  // Ambil data 6.2.3 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/6.2.3.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson623(jsonData));
  }, []);

  // Ambil data 6.2.4 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/6.2.4.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson624(jsonData));
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
          Statistik Transportasi Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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

            <FormControl size="small">
              <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
                Kecamatan
              </Typography>
              <Select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                sx={{ borderRadius: 3, fontWeight: 'bold', height: 40 }}
              >
                {kecamatanList.map((kec) => (
                  <MenuItem key={kec} value={kec}>
                    {kec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={4}>
            <TransportasiTerbanyakCard isLoading={isLoading} data={json621} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <PermukaanJalanCard isLoading={isLoading} data={json623} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <KondisiJalanCard isLoading={isLoading} data={json624} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <PieSaranaTransportasiCard isLoading={isLoading} data={json621} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <PieAngkutanCard isLoading={isLoading} data={json621} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <PieJalanTerluasCard isLoading={isLoading} data={json621} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <PieDilaluiKendaraanCard isLoading={isLoading} data={json621} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <StackedPanjangJalanCard isLoading={isLoading} data={json623} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <StackedKondisiJalanCard isLoading={isLoading} data={json624} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
