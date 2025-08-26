import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import RutaPerikananTangkapCard from './perikanan-component/RutaPerikananTangkapCard';
import RutaBudidayaCard from './perikanan-component/RutaBudidayaCard';
import ProduksiPerikananTangkapCard from './perikanan-component/ProduksiPerikananTangkapCard';
import ProduksiPerikananBudidayaCard from './perikanan-component/ProduksiPerikananBudidayaCard';
import PieRutaPerikananCard from './perikanan-component/PieRutaPerikananCard';
import PieRutaBudidayaCard from './perikanan-component/PieRutaBudidayaCard';
import PieProduksiPerikananCard from './perikanan-component/PieProduksiPerikananCard';
import PieProduksiBudidayaCard from './perikanan-component/PieProduksiBudidayaCard';
import BarJumlahKapalCard from './perikanan-component/BarJumlahKapalCard';

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

export default function Perikanan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 5.6.1-5.6.2 KDA
  const [json561, setJson561] = useState([]);
  // json untuk 5.6.3 KDA
  const [json563, setJson563] = useState([]);
  // json untuk 5.6.5 KDA
  const [json565, setJson565] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 5.6.1-5.6.2 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.6.1-5.6.2%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson561(jsonData);

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

  // Ambil data 5.6.3 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.6.3%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson563(jsonData));
  }, []);

  // Ambil data 5.6.5 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.6.5%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson565(jsonData));
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
          Statistik Perikanan Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
          <Grid item xs={12} md={6} lg={3}>
            <RutaPerikananTangkapCard isLoading={isLoading} data={json561} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <RutaBudidayaCard isLoading={isLoading} data={json563} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ProduksiPerikananTangkapCard isLoading={isLoading} data={json561} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ProduksiPerikananBudidayaCard isLoading={isLoading} data={json563} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={6}>
            <PieRutaPerikananCard isLoading={isLoading} data={json561} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <PieRutaBudidayaCard isLoading={isLoading} data={json563} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <PieProduksiPerikananCard isLoading={isLoading} data={json561} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <PieProduksiBudidayaCard isLoading={isLoading} data={json563} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <BarJumlahKapalCard isLoading={isLoading} data={json565} tahun={tahun} kecamatan={selectedKecamatan} />
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
