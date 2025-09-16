import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import PendudukMiskinKabkotCard from './perbandingan-component/PendudukMiskinKabkotCard';
import LajuADHKKabkotCard from './perbandingan-component/LajuADHKKabkotCard';
import IPMKabkotCard from './perbandingan-component/IPMKabKotaCard';
import IPMCard from './perbandingan-component/IPMCard';

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
  // json untuk 13.2 Laju ADHK KDA
  const [json132, setJson132] = useState([]);
  // json untuk 13.3 Penduduk Miskin KDA
  const [json133, setJson133] = useState([]);
  // json untuk 13.4 IPM KDA
  const [json134, setJson134] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 13.2 Laju ADHK KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/13.2%20Laju%20ADHK%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson132(jsonData);
      });
  }, []);

  // Ambil data 13.3 Penduduk Miskin KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/13.3%20Penduduk%20Miskin%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson133(jsonData));
  }, []);

  // Ambil data 13.4 IPM KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/13.4%20IPM%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson134(jsonData));
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
          Statistik Perbandingan Antarkabupaten di Provinsi Nusa Tenggara Timur
        </Typography>
      }
    >
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12} md={12} lg={12}>
            <LajuADHKKabkotCard isLoading={isLoading} data={json132} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <PendudukMiskinKabkotCard isLoading={isLoading} data={json133} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <IPMCard isLoading={isLoading} data={json134} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
