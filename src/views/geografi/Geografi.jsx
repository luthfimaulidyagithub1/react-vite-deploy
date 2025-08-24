import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import IbukotaKecCard from './geo-component/IbukotaKecCard';
import AreaKecCard from './geo-component/AreaKecCard';
import TotalDesaCard from './geo-component/TotalDesaCard';
import PersentaseLuasKabCard from './geo-component/PersentaseLuasKabCard';
import TinggiWilCard from './geo-component/TinggiWilCard';
import JarakKabCard from './geo-component/JarakKabCard';
import DonutLuasDesaCard from './geo-component/DonutLuasDesaCard';
import TabelLuasDesaCard from './geo-component/TabelLuasDesaCard';
import BarJarakDesaCard from './geo-component/BarJarakDesaCard';

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

export default function Geografi() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 1.1.1 KDA
  const [json, setJson] = useState([]);
  // json untuk 1.1
  const [json11, setjson11] = useState([]);
  // json untuk 1.2
  const [json12, setjson12] = useState([]);
  // json untuk luas 1.1.2 KDA
  const [json112, setjson112] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);
  const [mapStyle, setMapStyle] = useState('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json');
  const [sumberData, setSumberData] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data JSON
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/1.1.1%20KDA.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson(jsonData);

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

  // Ambil data 1.1 KDA
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/1.1.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setjson11(jsonData));
  }, []);

  // Ambil data 1.2 KDA
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/1.2.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setjson12(jsonData));
  }, []);

  // Ambil data 1.1.2 KDA
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/1.1.2%20KDA.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setjson112(jsonData));
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
          Keadaan Geografi Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
            <IbukotaKecCard isLoading={isLoading} data={json} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AreaKecCard isLoading={isLoading} data={json11} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TotalDesaCard isLoading={isLoading} data={json11} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={4}>
            <PersentaseLuasKabCard isLoading={isLoading} data={json} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TinggiWilCard isLoading={isLoading} data={json112} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <JarakKabCard isLoading={isLoading} data={json112} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={8}>
            <DonutLuasDesaCard isLoading={isLoading} data={json11} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <TabelLuasDesaCard isLoading={isLoading} data={json11} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <BarJarakDesaCard isLoading={isLoading} data={json12} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
