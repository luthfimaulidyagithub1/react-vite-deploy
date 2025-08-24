import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Typography, FormControl, Select, MenuItem, Stack } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SuhuRataCard from './iklim-component/SuhuRataCard';
import KelembabanRataCard from './iklim-component/KelembabanRataCard';
import AnginRataCard from './iklim-component/AnginRataCard';
import TekananUdaraCard from './iklim-component/TekananUdaraCard';
import LineChartCard from './iklim-component/LineChartCard';
import IklimTableCard from './iklim-component/IklimTableCard';
import CurahHujanLineCard from './iklim-component/CurahHujanLineCard';
import HariHujanLineCard from './iklim-component/HariHujanLineCard';
import MatahariLineCard from './iklim-component/MatahariLineCard';
import TabelCard from './iklim-component/TabelCard';

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

export default function Iklim() {
  const [isLoading, setLoading] = useState(true);
  const mapRef = useRef();

  // state data json
  const [jsonData, setJson] = useState([]);

  // filter tahun
  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');

  // filter indikator
  const [indikator, setIndikator] = useState('Suhu/Temperature (°C)');
  const indikatorList = ['Suhu/Temperature (°C)', 'Kelembaban/Humidity (%)', 'Kecepatan Angin (m/det)', 'Tekanan Udara (mbar)'];

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 1.2.1 JSON
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/1.2.1%20KDA.json', {
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
          Keadaan Iklim di Sumba menurut Stasiun Meteorologi Umbu Mehang Kunda, {tahun}
        </Typography>
      }
    >
      <CardContent>
        {/* Filter Tahun & Indikator */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Stack direction="row" spacing={2}>
            {/* Dropdown Tahun */}
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

            {/* Dropdown Indikator */}
            <FormControl size="small">
              <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
                Indikator Iklim
              </Typography>
              <Select
                value={indikator}
                onChange={(e) => setIndikator(e.target.value)}
                sx={{ borderRadius: 3, fontWeight: 'bold', height: 40 }}
              >
                {indikatorList.map((i) => (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Grid konten, bisa isi chart/tabel sesuai indikator */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3}>
            <SuhuRataCard isLoading={isLoading} data={jsonData} tahun={tahun} />{' '}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <KelembabanRataCard isLoading={isLoading} data={jsonData} tahun={tahun} />{' '}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <AnginRataCard isLoading={isLoading} data={jsonData} tahun={tahun} />{' '}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TekananUdaraCard isLoading={isLoading} data={jsonData} tahun={tahun} />{' '}
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={8}>
            <LineChartCard isLoading={isLoading} data={jsonData} tahun={tahun} indikator={indikator} />
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <IklimTableCard isLoading={isLoading} data={jsonData} tahun={tahun} indikator={indikator} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={8}>
              <Grid item xs={12} md={12} lg={12}>
                <CurahHujanLineCard isLoading={isLoading} data={jsonData} tahun={tahun} />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={6}>
                  <HariHujanLineCard isLoading={isLoading} data={jsonData} tahun={tahun} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <MatahariLineCard isLoading={isLoading} data={jsonData} tahun={tahun} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TabelCard isLoading={isLoading} data={jsonData} tahun={tahun} />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
