import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import JumlahBencanaAlamCard from './bencana-component/JumlahBencanaAlamCard';
import JumlahBencanaGempaCard from './bencana-component/JumlahBencanaGempaCard';
import JumlahBencanaLongsorCard from './bencana-component/JumlahBencanaLongsorCard';
import JumlahBencanaBanjirCard from './bencana-component/JumlahBencanaBanjirCard';
import JumlahBencanaKekeringanCard from './bencana-component/JumlahBencanaKekeringanCard';
import JumlahBencanaAnginCard from './bencana-component/JumlahBencanaAnginCard';
import PieBencanaCard from './perumahan-component/PieBencanaCard';
import PieKorbanBencanaCard from './perumahan-component/PieKorbanBencanaCard';
import TabelMitigasiBencanaCard from './bencana-component/TabelMitigasiBencanaCard';

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

export default function BencanaAlam() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 4.4.2-4.4.3
  const [json442, setJson442] = useState([]);
  // json untuk 4.4.4 KDA
  const [json444, setJson444] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 4.4.2-4.4.3 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.4.2-4.4.3.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson442(jsonData);

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

  // Ambil data 4.4.4
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/4.4.4.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson444(jsonData));
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
          Keadaan Bencana Alam Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
            <JumlahBencanaAlamCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahBencanaGempaCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahBencanaLongsorCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahBencanaBanjirCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahBencanaKekeringanCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <JumlahBencanaAnginCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <PieBencanaCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <PieKorbanBencanaCard isLoading={isLoading} data={json442} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <TabelMitigasiBencanaCard isLoading={isLoading} data={json444} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
