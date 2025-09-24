import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import AirMinumTerbanyakCard from './perumahan-component/AirMinumTerbanyakCard';
import JumlahDesaJambanCard from './perumahan-component/JumlahDesaJambanCard';
import PersentaseListrikCard from './perumahan-component/PersentaseListrikCard';
import BarDesaAirMinumCard from './perumahan-component/BarDesaAirMinumCard';
import PieListrikCard from './perumahan-component/PieListrikCard';
import PieJenisListrikCard from './perumahan-component/PieJenisListrikCard';
import PiePeneranganJalanCard from './perumahan-component/PiePeneranganJalanCard';
import PieFasilitasBABCard from './perumahan-component/PieFasilitasBABCard';
import PieJambanCard from './perumahan-component/PieJambanCard';
import PieJenisBBMCard from './perumahan-component/PieJenisBBMCard';

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

export default function Perumahan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 4.3.1
  const [json431, setJson431] = useState([]);
  // json untuk 4.3.2
  const [json432, setJson432] = useState([]);
  // json untuk 4.3.3
  const [json433, setJson433] = useState([]);
  // json untuk 4.3.4
  const [json434, setJson434] = useState([]);
  // json untuk 4.3.5
  const [json435, setJson435] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 4.3.1 JSON
  // https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.3.1.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson431(jsonData);

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

  // Ambil data 4.3.2 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.3.2.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson432(jsonData));
  }, []);

  // Ambil data 4.3.3 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.3.3.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson433(jsonData));
  }, []);

  // Ambil data 4.3.4 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.3.4.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson434(jsonData));
  }, []);

  // Ambil data 4.3.5 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.3.5.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson435(jsonData));
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
          Keadaan Perumahan dan Lingkungan Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
            <AirMinumTerbanyakCard isLoading={isLoading} data={json431} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahDesaJambanCard isLoading={isLoading} data={json434} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <PersentaseListrikCard isLoading={isLoading} data={json432} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <BarDesaAirMinumCard isLoading={isLoading} data={json431} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={4}>
            <PieListrikCard isLoading={isLoading} data={json432} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieJenisListrikCard isLoading={isLoading} data={json432} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PiePeneranganJalanCard isLoading={isLoading} data={json433} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieFasilitasBABCard isLoading={isLoading} data={json434} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieJambanCard isLoading={isLoading} data={json434} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieJenisBBMCard isLoading={isLoading} data={json435} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
