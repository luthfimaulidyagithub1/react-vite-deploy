import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import LineJumlahPelangganListrikCard from './energi-component/LineJumlahPelangganListrikCard';
import PiePelangganListrikCard from './energi-component/PiePelangganListrikCard';

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

export default function Energi() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 6.2 KDA
  const [json62, setJson62] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua'); // ✅ default semua kecamatan
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 6.2 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/6.2%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson62(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);

        // ambil kecamatan unik + tambahkan "Semua Kecamatan"
        const kecamatanUnik = [...new Set(jsonData.map((d) => d.kecamatan))].sort();
        setKecamatanList(['Semua', ...kecamatanUnik]);

        setSelectedKecamatan('Semua');

        // // isi kecamatanList
        // const kecamatanUnik = [...new Set(jsonData.map((d) => d.kecamatan))].sort();
        // setKecamatanList(kecamatanUnik);

        // // ✅ set default ke "Kota Waikabubak" kalau ada di list
        // if (kecamatanUnik.includes('Kota Waikabubak')) {
        //   setSelectedKecamatan('Kota Waikabubak');
        // } else {
        //   setSelectedKecamatan(kecamatanUnik[0]); // fallback ke pertama
        // }
      });
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
          Jumlah Pelanggan Listrik menurut Kecamatan dan Tahun di Kabupaten Sumba Barat
        </Typography>
      }
    >
      <CardContent>
        {/* Filter Kecamatan */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Stack direction="row" spacing={2}>
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
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12} lg={12}>
            <LineJumlahPelangganListrikCard isLoading={isLoading} data={json62} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>

        {/* Filter Tahun */}
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
          <Grid item xs={12} md={12} lg={12}>
            <PiePelangganListrikCard isLoading={isLoading} data={json62} tahun={tahun} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
