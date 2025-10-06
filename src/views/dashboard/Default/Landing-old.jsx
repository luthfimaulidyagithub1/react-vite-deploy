// import AuthWrapper1 from './AuthWrapper1';
import AuthWrapper1 from '../../pages/authentication/AuthWrapper1';

import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';

// material-ui
import { Box, CardContent, Paper, Typography, FormControl, Select, MenuItem, Stack, IconButton, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import IntroPopup from '../../../ui-component/IntroPopup';

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

export default function Beranda({ isLoading }) {
  const mapRef = useRef();
  const [data, setData] = useState(null);
  const [json, setJson] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [tahun, setTahun] = useState('');
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [mapStyle, setMapStyle] = useState('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'); // default satelit
  const [sumberData, setSumberData] = useState([]);

  // Ambil data JSON
  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/latlong_wil.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setJson(jsonData);
        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        setTahunList(tahunUnik);
        if (tahunUnik.length > 0) setTahun(tahunUnik[tahunUnik.length - 1]);
        const sumberUnik = [...new Set(jsonData.flatMap((d) => d.sumber || []))];
        setSumberData(sumberUnik);
      });
  }, []);

  // Generate GeoJSON
  useEffect(() => {
    if (!tahun || json.length === 0) return;
    const filtered = json.filter((d) => d.tahun === tahun);
    const kecamatanMap = filtered.reduce((acc, d) => {
      if (!acc[d.kecamatan]) {
        acc[d.kecamatan] = {
          kecamatan: d.kecamatan,
          coord: d['latitude,longitude kec'],
          totalPenduduk: 0,
          totalKK: 0,
          totalLuas: 0,
          totalLaki: 0,
          totalPerempuan: 0
        };
      }
      acc[d.kecamatan].totalPenduduk += +d.penduduk;
      acc[d.kecamatan].totalKK += +d.kk;
      acc[d.kecamatan].totalLuas += +d['luas desa (km2)'];
      acc[d.kecamatan].totalLaki += +d['penduduk laki'];
      acc[d.kecamatan].totalPerempuan += +d['penduduk perempuan'];
      return acc;
    }, {});

    const features = Object.values(kecamatanMap).map((d) => {
      const [lat, lon] = d.coord.split(',').map(parseFloat);
      const kepadatan = d.totalLuas > 0 ? d.totalPenduduk / d.totalLuas : 0;
      const rasioJK = d.totalPerempuan > 0 ? Math.round((d.totalLaki / d.totalPerempuan) * 100) : 0;

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: {
          kecamatan: d.kecamatan,
          penduduk: d.totalPenduduk,
          kk: d.totalKK,
          luasWilayah: d.totalLuas.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          kepadatanPenduduk: kepadatan.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          rasioJenisKelamin: rasioJK
        }
      };
    });

    setData({ type: 'FeatureCollection', features });
    setKecamatanList([...Object.keys(kecamatanMap)]);
  }, [tahun, json]);

  // Fit viewport otomatis saat data pertama kali load
  useEffect(() => {
    if (!data || !mapRef.current || data.features.length === 0) return;
    const coordinates = data.features.map((f) => f.geometry.coordinates);
    const lons = coordinates.map((c) => c[0]);
    const lats = coordinates.map((c) => c[1]);
    mapRef.current.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)]
      ],
      { padding: 50, duration: 0 }
    );
  }, [data]);

  // Fit map saat klik bubble
  useEffect(() => {
    if (selectedFeature && data && mapRef.current) {
      const feature = data.features.find((f) => f.properties.kecamatan === selectedFeature);
      if (feature) {
        mapRef.current.flyTo({ center: feature.geometry.coordinates, zoom: 12 });
      }
    }
  }, [selectedFeature, data]);

  const resetView = () => {
    setSelectedFeature(null);
    if (data && mapRef.current) {
      const coordinates = data.features.map((f) => f.geometry.coordinates);
      const lons = coordinates.map((c) => c[0]);
      const lats = coordinates.map((c) => c[1]);
      mapRef.current.fitBounds(
        [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)]
        ],
        { padding: 50, duration: 1000 }
      );
    }
  };

  // Bubble & Hover Layer Colors
  const berryColors = ['#1976d2', '#9c27b0', '#009688', '#e91e63', '#f44336', '#ff9800', '#4caf50', '#3f51b5'];
  const kecamatanColors = {};
  kecamatanList.forEach((kec, i) => {
    if (kec !== 'Semua') kecamatanColors[kec] = berryColors[i % berryColors.length];
  });

  const pendudukValues = data?.features.map((f) => f.properties.penduduk) || [];
  const minPenduduk = pendudukValues.length > 0 ? Math.min(...pendudukValues) : 1;
  const maxPenduduk = pendudukValues.length > 0 ? Math.max(...pendudukValues) : 10;

  const bubbleLayer = {
    id: 'bubbles',
    type: 'circle',
    source: 'penduduk',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['sqrt', ['get', 'penduduk']], Math.sqrt(minPenduduk), 20, Math.sqrt(maxPenduduk), 40],
      'circle-color': ['match', ['get', 'kecamatan'], ...Object.entries(kecamatanColors).flat(), '#1976d2'],
      'circle-opacity': selectedFeature ? ['case', ['==', ['get', 'kecamatan'], selectedFeature], 0.8, 0.2] : 0.6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    filter: selectedKecamatan === 'Semua' ? true : ['==', ['get', 'kecamatan'], selectedKecamatan]
  };

  const hoverLayer = hoverInfo
    ? {
        id: 'hover-bubble',
        type: 'circle',
        source: 'penduduk',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['ln', ['get', 'penduduk']], Math.log(minPenduduk), 10, Math.log(maxPenduduk), 25],
          'circle-color': kecamatanColors[hoverInfo.kecamatan] || '#000',
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000'
        },
        filter: ['==', ['get', 'kecamatan'], hoverInfo.kecamatan]
      }
    : null;

  const barChartData =
    selectedKecamatan === 'Semua'
      ? (data?.features || []).map((f) => ({
          kecamatan: f.properties.kecamatan,
          kk: f.properties.kk,
          penduduk: f.properties.penduduk,
          luasWilayah: f.properties.luasWilayah,
          kepadatanPenduduk: f.properties.kepadatanPenduduk,
          rasioJenisKelamin: f.properties.rasioJenisKelamin
        }))
      : [
          {
            kecamatan: selectedKecamatan,
            kk: data?.features.find((f) => f.properties.kecamatan === selectedKecamatan)?.properties.kk || 0,
            penduduk: data?.features.find((f) => f.properties.kecamatan === selectedKecamatan)?.properties.penduduk || 0,
            luasWilayah: data?.features.find((f) => f.properties.kecamatan === selectedKecamatan)?.properties.luasWilayah || '0,00',
            kepadatanPenduduk:
              data?.features.find((f) => f.properties.kecamatan === selectedKecamatan)?.properties.kepadatanPenduduk || '0,00',
            rasioJenisKelamin: data?.features.find((f) => f.properties.kecamatan === selectedKecamatan)?.properties.rasioJenisKelamin || 0
          }
        ];

  return (
    <AuthWrapper1>
      <IntroPopup />
    </AuthWrapper1>
    // <>
    //   {isLoading ? (
    //     <SkeletonPopularCard />
    //   ) : (
    //     <MainCard content={false}>
    //       <IntroPopup />

    //       <CardContent>
    //         <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
    //           Indikator Kependudukan Setiap Kecamatan di Kabupaten Sumba Barat Tahun {tahun}
    //         </Typography>

    //         {/* Filter Tahun & Kecamatan */}
    //         <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
    //           <Stack direction="row" spacing={2}>
    //             <FormControl size="small">
    //               <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
    //                 Tahun
    //               </Typography>
    //               <Select value={tahun} onChange={(e) => setTahun(e.target.value)} sx={{ borderRadius: 3, fontWeight: 'bold', height: 40 }}>
    //                 {tahunList.map((t) => (
    //                   <MenuItem key={t} value={t}>
    //                     {t}
    //                   </MenuItem>
    //                 ))}
    //               </Select>
    //             </FormControl>
    //             <FormControl size="small">
    //               <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.secondary' }}>
    //                 Kecamatan
    //               </Typography>
    //               <Select
    //                 value={selectedKecamatan}
    //                 onChange={(e) => setSelectedKecamatan(e.target.value)}
    //                 sx={{ borderRadius: 3, fontWeight: 'bold', height: 40 }}
    //               >
    //                 <MenuItem value="Semua">Semua</MenuItem>
    //                 {kecamatanList.map((kec) => (
    //                   <MenuItem key={kec} value={kec}>
    //                     {kec}
    //                   </MenuItem>
    //                 ))}
    //               </Select>
    //             </FormControl>
    //           </Stack>
    //         </Box>

    //         {/* Map */}
    //         <Box sx={{ position: 'relative', mb: 1 }}>
    //           <Map
    //             ref={mapRef}
    //             mapLib={import('maplibre-gl')}
    //             initialViewState={{ latitude: -9.7, longitude: 119.3, zoom: 9 }}
    //             style={{ width: '100%', height: '60vh' }}
    //             mapStyle={mapStyle}
    //             interactiveLayerIds={['bubbles']}
    //             onMouseMove={(e) => {
    //               const feature = e.features && e.features[0];
    //               setHoverInfo(
    //                 feature
    //                   ? {
    //                       longitude: e.lngLat.lng,
    //                       latitude: e.lngLat.lat,
    //                       kecamatan: feature.properties.kecamatan,
    //                       penduduk: feature.properties.penduduk,
    //                       luasWilayah: feature.properties.luasWilayah,
    //                       kepadatanPenduduk: feature.properties.kepadatanPenduduk,
    //                       rasioJenisKelamin: feature.properties.rasioJenisKelamin
    //                     }
    //                   : null
    //               );
    //             }}
    //             onMouseLeave={() => setHoverInfo(null)}
    //             onClick={(e) => {
    //               const feature = e.features && e.features[0];
    //               setSelectedFeature(feature ? feature.properties.kecamatan : null);
    //             }}
    //           >
    //             <NavigationControl position="bottom-right" />
    //             {data && (
    //               <Source id="penduduk" type="geojson" data={data}>
    //                 <Layer {...bubbleLayer} />
    //                 {hoverLayer && <Layer {...hoverLayer} />}
    //               </Source>
    //             )}
    //             {hoverInfo && (
    //               <Popup
    //                 longitude={hoverInfo.longitude}
    //                 latitude={hoverInfo.latitude}
    //                 closeButton={false}
    //                 closeOnClick={false}
    //                 anchor="top"
    //               >
    //                 <Paper sx={{ p: 1, borderRadius: 1 }}>
    //                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: kecamatanColors[hoverInfo.kecamatan] || '#000' }}>
    //                     Kecamatan {hoverInfo.kecamatan}
    //                   </Typography>
    //                   <Typography variant="body2">Penduduk: {hoverInfo.penduduk.toLocaleString('id-ID')}</Typography>
    //                   <Typography variant="body2">Luas Wilayah: {hoverInfo.luasWilayah} km²</Typography>
    //                   <Typography variant="body2">Kepadatan: {hoverInfo.kepadatanPenduduk} / km²</Typography>
    //                   <Typography variant="body2">Rasio JK: {hoverInfo.rasioJenisKelamin}</Typography>
    //                 </Paper>
    //               </Popup>
    //             )}
    //           </Map>

    //           {/* Map Controls */}
    //           <Paper
    //             sx={{
    //               position: 'absolute',
    //               top: 8,
    //               right: 8,
    //               zIndex: 10,
    //               p: 1,
    //               borderRadius: 3,
    //               boxShadow: 3,
    //               display: 'flex',
    //               flexDirection: 'column',
    //               gap: 1,
    //               backgroundColor: 'rgba(255,255,255,0.9)'
    //             }}
    //           >
    //             <Tooltip title="Reset Tampilan">
    //               <IconButton size="small" onClick={resetView}>
    //                 <RestartAltIcon />
    //               </IconButton>
    //             </Tooltip>
    //             <Tooltip title="Map">
    //               <IconButton size="small" onClick={() => setMapStyle('https://basemaps.cartocdn.com/gl/positron-gl-style/style.json')}>
    //                 <MapIcon />
    //               </IconButton>
    //             </Tooltip>
    //             <Tooltip title="Satelit">
    //               <IconButton size="small" onClick={() => setMapStyle('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json')}>
    //                 <SatelliteAltIcon />
    //               </IconButton>
    //             </Tooltip>
    //             <Tooltip title="Dark Mode">
    //               <IconButton size="small" onClick={() => setMapStyle('https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json')}>
    //                 <DarkModeIcon />
    //               </IconButton>
    //             </Tooltip>
    //           </Paper>
    //         </Box>

    //         {/* Sumber Map */}
    //         {sumberData.length > 0 && (
    //           <Typography variant="caption" align="left" sx={{ mb: 3, display: 'block', fontStyle: 'italic' }}>
    //             Sumber: BPS dan {sumberData.join(', ')}
    //           </Typography>
    //         )}

    //         {/* Bar Chart */}
    //         <Paper sx={{ p: 2, mb: 1 }}>
    //           <Typography variant="h6" gutterBottom>
    //             Statistik Jumlah Penduduk dan Jumlah KK Menurut Kecamatan Tahun {tahun}
    //           </Typography>
    //           <ResponsiveContainer width="100%" height={400}>
    //             <BarChart data={barChartData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
    //               <CartesianGrid vertical={false} strokeDasharray="3 3" />
    //               <XAxis dataKey="kecamatan" />
    //               <YAxis />
    //               <ReTooltip formatter={(value, name) => [value.toLocaleString('id-ID'), name]} />
    //               <Legend />
    //               <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
    //               <Bar dataKey="kk" fill="#90CAF9" name="Jumlah KK">
    //                 <LabelList dataKey="kk" position="top" formatter={(v) => v.toLocaleString('id-ID')} />
    //               </Bar>
    //               <Bar dataKey="penduduk" fill="#2196F3" name="Jumlah Penduduk">
    //                 <LabelList dataKey="penduduk" position="top" formatter={(v) => v.toLocaleString('id-ID')} />
    //               </Bar>
    //             </BarChart>
    //           </ResponsiveContainer>
    //         </Paper>

    //         {/* Sumber Bar Chart */}
    //         {sumberData.length > 0 && (
    //           <Typography variant="caption" align="left" sx={{ display: 'block', fontStyle: 'italic', mb: 2 }}>
    //             Sumber: BPS dan {sumberData.join(', ')}
    //           </Typography>
    //         )}
    //       </CardContent>
    //     </MainCard>
    //   )}
    // </>
  );
}

Beranda.propTypes = {
  isLoading: PropTypes.bool
};
