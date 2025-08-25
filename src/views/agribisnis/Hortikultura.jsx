import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Grid, Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import LuasPanenSayuranCard from './hortikulltura-component/LuasPanenSayuranCard';
import LuasPanenBuahCard from './hortikulltura-component/LuasPanenBuahCard';
import LuasPanenBiofarmakaCard from './hortikulltura-component/LuasPanenBiofarmakaCard';
import ProduksiSayuranCard from './hortikulltura-component/ProduksiSayuranCard';
import ProduksiBuahCard from './hortikulltura-component/ProduksiBuahCard';
import ProduksiBiofarmakaCard from './hortikulltura-component/ProduksiBiokafarmaCard';
import DonutPanenSayurCard from './hortikulltura-component/DonutPanenSayurCard';
import DonutPanenBuahCard from './hortikulltura-component/DonutPanenBuahCard';
import DonutProduksiSayurSemusimCard from './hortikulltura-component/DonutProduksiSayurSemusimCard';
import DonutProduksiBuahSemusimCard from './hortikulltura-component/DonutProduksiBuahSemusimCard';
import DonutProduksiSayuranTahunanCard from './hortikulltura-component/DonutProduksiSayuranTahunanCard';
import DonutProduksiBuahTahunanCard from './hortikulltura-component/DonutProduksiBuahTahunanCard';
import DonutPanenBiofarmakaCard from './hortikulltura-component/DonutPanenBiofarmakaCard';
import DonutProduksiBiofarmakaCard from './hortikulltura-component/DonutProduksiBiofarmakaCard';

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
  // json untuk 5.1 Luas Panen KDA
  const [json511, setJson511] = useState([]);
  // json untuk 5.1 Total Produksi KDA
  const [json512, setJson512] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Kota Waikabubak'); // ✅ default langsung Kota Waikabubak
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ambil data 5.1 Luas Panen KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.1%20Luas%20Panen%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson511(jsonData);

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

  // Ambil data 5.1 Total Produksi KDA
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/5.1%20Total%20Produksi%20KDA.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => setJson512(jsonData));
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
          Statistik Hortikultura Setiap Kecamatan di Kabupaten Sumba Barat, {tahun}
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
            <LuasPanenSayuranCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LuasPanenBuahCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LuasPanenBiofarmakaCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6} lg={4}>
            <ProduksiSayuranCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ProduksiBuahCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ProduksiBiofarmakaCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <DonutPanenSayurCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DonutPanenBuahCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <DonutProduksiSayurSemusimCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DonutProduksiBuahSemusimCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <DonutProduksiSayuranTahunanCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DonutProduksiBuahTahunanCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={12} lg={6}>
            <DonutPanenBiofarmakaCard isLoading={isLoading} data={json511} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <DonutProduksiBiofarmakaCard isLoading={isLoading} data={json512} tahun={tahun} kecamatan={selectedKecamatan} />
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}
