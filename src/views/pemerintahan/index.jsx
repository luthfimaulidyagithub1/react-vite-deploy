import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import DusunCard from './pemerintahan-component/DusunCard';
import RWCard from './pemerintahan-component/RWCard';
import RTCard from './pemerintahan-component/RTCard';
import BarStrukturDesaCard from './pemerintahan-component/BarStrukturDesaCard';
import PiePerkembanganDesaCard from './pemerintahan-component/PiePerkembanganDesaCard';
import StackedPegawaiCard from './pemerintahan-component/StackedPegawaiCard';

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

export default function Pemerintahan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 2.1.1 KDA
  const [json211, setJson211] = useState([]);
  // json untuk 2.2.1 KDA
  const [json221, setJson221] = useState([]);
  // json untuk 2.2.3 KDA
  const [json223, setJson223] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);
  const [mapStyle, setMapStyle] = useState('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json');
  const [sumberData, setSumberData] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 2.1.1 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/2.1.1.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson211(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);

        // isi sumberData
        const sumberUnik = [...new Set(jsonData.flatMap((d) => d.sumber || []))];
        setSumberData(sumberUnik);

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

  // Ambil data 2.2.1 KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/2.2.1.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson221(jsonData));
  }, []);

  // Ambil data 2.2.3 KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/2.2.3.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson223(jsonData));
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
          Statistik Pemerintahan Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
            <DusunCard isLoading={isLoading} data={json211} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <RWCard isLoading={isLoading} data={json211} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <RTCard isLoading={isLoading} data={json211} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <BarStrukturDesaCard isLoading={isLoading} data={json211} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <PiePerkembanganDesaCard isLoading={isLoading} data={json223} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <StackedPegawaiCard isLoading={isLoading} data={json221} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
