import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import StackedPDRBCard from './neraca-component/StackedPDRBCard';
import LajuPDRBLineChart from './neraca-component/LajuPDRBLineChart';
import StackedPDRBPengeluaranCard from './neraca-component/StackedPDRBPengeluaranCard';
import LajuPDRBPengeluaranCard from './neraca-component/LajuPDRBPengeluaranCard';
import LajuPDRBLapusCard from './neraca-component/LajuPDRBLapusCard';
import PDRBPengeluaranLineCard from './neraca-component/PDRBPengeluaranLineCard';
import StackedPDRBAdhkCard from './neraca-component/StackedPDRBAdhkCard';

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

export default function Perdagangan() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();
  // json untuk 12.1 dan 12.3 KDA
  const [json121, setJson121] = useState([]);
  // json untuk 12.2 dan 12.4 KDA
  const [json122, setJson122] = useState([]);
  // json untuk 12.5 dan 12.7 KDA
  const [json125, setJson125] = useState([]);
  // json untuk 12.6 dan 12.8 KDA
  const [json126, setJson126] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 12.1 dan 12.3 KDA JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/12.1%20dan%2012.3%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson121(jsonData);

        // isi tahunList
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);
      });
  }, []);

  // Ambil data 12.2 dan 12.4 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/12.2%20dan%2012.4%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson122(jsonData));
  }, []);

  // Ambil data 12.5 dan 12.7 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/12.5%20dan%2012.7%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson125(jsonData));
  }, []);

  // Ambil data 12.6 dan 12.8 JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/12.6%20dan%2012.8%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson126(jsonData));
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
          Sistem Neraca Regional Kabupaten Sumba Barat
        </Typography>
      }
    >
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={12} lg={12}>
            <StackedPDRBCard isLoading={isLoading} data={json121} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <StackedPDRBAdhkCard isLoading={isLoading} data={json122} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <LajuPDRBLapusCard isLoading={isLoading} data={json122} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <PDRBPengeluaranLineCard isLoading={isLoading} data={json125} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <LajuPDRBPengeluaranCard isLoading={isLoading} data={json126} />
          </Grid>
        </Grid>
        {/* <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <LajuPDRBLapusCard isLoading={isLoading} data={json122} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <PDRBPengeluaranLineCard isLoading={isLoading} data={json125} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={12}>
            <LajuPDRBPengeluaranCard isLoading={isLoading} data={json126} />
          </Grid>
        </Grid> */}
      </CardContent>
    </MainCard>
  );
}
