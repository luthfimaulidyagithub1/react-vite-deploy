import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

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
  // json untuk 4.1.1
  const [json411, setJson411] = useState([]);
  // json untuk 4.1.2-4.1.4
  const [json412, setJson412] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 4.1.1 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.1.1.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson411(jsonData);

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

  // Ambil data 4.1.2-4.1.4
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.1.2-4.1.4.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson412(jsonData));
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
          <Grid item xs={12} md={6} lg={4}>
            {/* <JumlahSekolahCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {/* <JumlahSekolahNegeriCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {/* <JumlahSekolahSwastaCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            {/* <BarJumlahDesaSekolahCard isLoading={isLoading} data={json411} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            {/* <DonutFasilitasSekolahCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={4}>
            {/* <JumlahGuruCard isLoading={isLoading} data={json412} tahun={tahun} kecamatan={selectedKecamatan} /> */}
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
