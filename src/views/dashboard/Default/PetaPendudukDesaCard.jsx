import React, { useEffect, useState, useRef } from 'react';
import { CardContent, Typography, Box, Paper, MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

import Map, { Source, Layer, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import LayersIcon from '@mui/icons-material/Layers';
import { useTheme } from '@mui/material/styles';

// === MapStyle Satelit Esri ===
const esriSatellite = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: "© <a href='https://www.esri.com/en-us/home'>Esri</a>, Earthstar Geographics"
    }
  },
  layers: [
    {
      id: 'esri-satellite',
      type: 'raster',
      source: 'esri',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export default function PetaPendudukDesaCard({ isLoading }) {
  const theme = useTheme();
  const mapRef = useRef();
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState(null); // Ini untuk GeoJSON asli
  const [allPopulasiData, setAllPopulasiData] = useState(null); // Ini untuk data populasi
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedKec, setSelectedKec] = useState('all');
  const [listKecamatan, setListKecamatan] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [sumberData, setSumberData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(''); // State baru untuk tahun
  const [listYears, setListYears] = useState([]); // State baru untuk daftar tahun

  const legendTitles = {
    penduduk: 'Rentang Jumlah Penduduk',
    luas: 'Rentang Luas Wilayah (km²)',
    kepadatan: 'Rentang Kepadatan Penduduk',
    rasiojk: 'Rentang Rasio Jenis Kelamin'
  };

  const indikatorList = [
    { key: 'penduduk', label: 'Jumlah Penduduk' },
    { key: 'luas', label: 'Luas Wilayah (km²)' },
    { key: 'kepadatan', label: 'Kepadatan Penduduk (per km²)' },
    { key: 'rasiojk', label: 'Rasio Jenis Kelamin' }
  ];
  const [selectedIndicator, setSelectedIndicator] = useState('penduduk');

  // Load GeoJSON & Data Populasi
  useEffect(() => {
    Promise.all([
      fetch('/Peta_desa_5301.geojson').then((res) => res.json()),
      fetch('https://luthfimaulidyagithub1.github.io/DDA-json/latlong_wil.json').then((res) => res.json())
    ]).then(([geo, penduduk]) => {
      setAllData(geo);
      setAllPopulasiData(penduduk);
      const kecList = Array.from(new Set(geo.features.map((f) => f.properties.nmkec))).sort();
      setListKecamatan(kecList);
      const uniqueYears = [...new Set(penduduk.map((d) => d.tahun))].sort().reverse();
      setListYears(uniqueYears);
      if (uniqueYears.length > 0) {
        setSelectedYear(uniqueYears[0]);
      }
      const sumberUnik = [...new Set(penduduk.flatMap((d) => d.sumber || []))];
      setSumberData(sumberUnik);
    });
  }, []);

  // Filter data berdasarkan tahun dan kecamatan
  useEffect(() => {
    if (!allData || !allPopulasiData || !selectedYear) return;

    // Filter populasi data berdasarkan tahun
    const filteredPopulasi = allPopulasiData.filter((d) => d.tahun === selectedYear);

    const desaMap = {};
    filteredPopulasi.forEach((d) => {
      desaMap[d.iddesa] = {
        penduduk: +d.penduduk || 0,
        luas: +d['luas desa (km2)'] || 0,
        kepadatan: +d['kepadatan penduduk (per km2)'] || 0,
        rasiojk: +d['rasio jk'] || 0,
        nmdesa: d.deskel
      };
    });

    const newGeo = {
      ...allData,
      features: allData.features.map((f) => {
        const id = f.properties.iddesa;
        const values = desaMap[id] || {
          penduduk: 0,
          luas: 0,
          kepadatan: 0,
          rasiojk: 0,
          nmdesa: f.properties.nmdesa || 'Tidak ada nama'
        };

        return {
          ...f,
          properties: {
            ...f.properties,
            ...values
          }
        };
      })
    };

    // Filter GeoJSON berdasarkan kecamatan
    if (selectedKec === 'all') {
      setData(newGeo);
    } else {
      setData({
        ...newGeo,
        features: newGeo.features.filter((f) => f.properties.nmkec === selectedKec)
      });
    }
  }, [selectedYear, selectedKec, allData, allPopulasiData]);

  // Fit bounds otomatis
  useEffect(() => {
    if (!data || !mapRef.current) return;
    const allCoords = data.features.flatMap((f) =>
      f.geometry.type === 'Polygon' ? f.geometry.coordinates[0] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat(2) : []
    );
    if (allCoords.length === 0) return;

    const lons = allCoords.map((c) => c[0]);
    const lats = allCoords.map((c) => c[1]);

    mapRef.current.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)]
      ],
      { padding: 50, duration: 0 }
    );
  }, [data]);

  // Skala warna choropleth
  const values = data?.features.map((f) => f.properties[selectedIndicator]) || [];
  let minVal = values.length > 0 ? Math.min(...values) : 0;
  let maxVal = values.length > 0 ? Math.max(...values) : 1;
  if (minVal === maxVal) minVal = 0;
  const step = (maxVal - minVal) / 6;

  const colorPalettes = {
    penduduk: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'],
    luas: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#e6550d', '#a63603'],
    kepadatan: ['#f7fcf0', '#ccebc5', '#a8ddb5', '#7bccc4', '#2b8cbe', '#084081'],
    rasiojk: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#ce1256']
  };
  const palette = colorPalettes[selectedIndicator] || colorPalettes['penduduk'];

  const colorRamp = [
    'step',
    ['get', selectedIndicator],
    palette[0],
    minVal + step,
    palette[1],
    minVal + step * 2,
    palette[2],
    minVal + step * 3,
    palette[3],
    minVal + step * 4,
    palette[4],
    minVal + step * 5,
    palette[5]
  ];

  const fillLayer = {
    id: 'desa-fill',
    type: 'fill',
    paint: {
      'fill-color': colorRamp,
      'fill-opacity': 1.0
    }
  };

  const outlineLayer = {
    id: 'desa-outline',
    type: 'line',
    paint: { 'line-color': '#000', 'line-width': 0.5 }
  };

  const handleClick = (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;
    setSelectedFeature(feature.properties.iddesa);

    const coords =
      feature.geometry.type === 'Polygon'
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === 'MultiPolygon'
          ? feature.geometry.coordinates[0][0]
          : null;

    if (coords && mapRef.current) {
      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      mapRef.current.fitBounds(
        [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)]
        ],
        { padding: 50, duration: 1000 }
      );
    }
  };

  // Menggabungkan logika hover dan klik
  const handleMapInteraction = (e) => {
    const feature = e.features && e.features[0];
    if (feature) {
      setHoverInfo({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        nama: feature.properties.nmdesa,
        value: feature.properties[selectedIndicator]
      });
    } else {
      setHoverInfo(null);
    }
  };

  const getPopupText = (indicator, value) => {
    switch (indicator) {
      case 'kepadatan':
        const kepadatanValue = value?.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        let kepadatanInterpretation = `Rata-rata terdapat ${kepadatanValue} penduduk di setiap 1 km² di desa ini.`;
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Kepadatan Penduduk: {kepadatanValue} jiwa/km²
            </Typography>
            <Typography variant="body2">Artinya: {kepadatanInterpretation}</Typography>
          </>
        );

      case 'rasiojk':
        const rasioValue = Math.round(value).toLocaleString('id-ID');
        let rasioInterpretation = '';
        if (value > 100) {
          rasioInterpretation = `Jumlah penduduk laki-laki lebih banyak dari perempuan (sekitar ${Math.round(value - 100)}% lebih banyak)`;
        } else if (value < 100) {
          rasioInterpretation = `Jumlah penduduk perempuan lebih banyak dari laki-laki (sekitar ${Math.round(100 - value)}% lebih banyak)`;
        } else {
          rasioInterpretation = 'Jumlah penduduk laki-laki dan perempuan relatif seimbang';
        }
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Rasio Jenis Kelamin: {rasioValue}
            </Typography>
            <Typography variant="body2">Artinya: {rasioInterpretation}</Typography>
          </>
        );

      case 'luas':
        const luasValue = value?.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return (
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Luas wilayah desa: {luasValue} km²
          </Typography>
        );

      case 'penduduk':
        const pendudukValue = value?.toLocaleString('id-ID');
        return (
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Jumlah penduduk: {pendudukValue} jiwa
          </Typography>
        );

      default:
        return <Typography variant="body2">Data tidak tersedia</Typography>;
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
              Peta {indikatorList.find((i) => i.key === selectedIndicator)?.label} per Desa di Kabupaten Sumba Barat
            </Typography>
            {/* Box untuk menyatukan filter dalam satu baris */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {/* Dropdown Filter Tahun */}
              <FormControl sx={{ flexGrow: 1, minWidth: '120px' }}>
                <InputLabel id="year-filter-label">Tahun</InputLabel>
                <Select
                  labelId="year-filter-label"
                  id="year-filter"
                  value={selectedYear}
                  label="Tahun"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {listYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown Filter Kecamatan */}
              <FormControl sx={{ flexGrow: 1, minWidth: '180px' }}>
                <InputLabel>Kecamatan</InputLabel>
                <Select value={selectedKec} label="Kecamatan" onChange={(e) => setSelectedKec(e.target.value)}>
                  <MenuItem value="all">Semua Kecamatan</MenuItem>
                  {listKecamatan.map((kec) => (
                    <MenuItem key={kec} value={kec}>
                      {kec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown Pilih Indikator */}
              <FormControl sx={{ flexGrow: 1, minWidth: '150px' }}>
                <InputLabel>Indikator</InputLabel>
                <Select value={selectedIndicator} label="Indikator" onChange={(e) => setSelectedIndicator(e.target.value)}>
                  {indikatorList.map((ind) => (
                    <MenuItem key={ind.key} value={ind.key}>
                      {ind.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* Map + Controls + Legend */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Map
                ref={mapRef}
                mapLib={import('maplibre-gl')}
                initialViewState={{ latitude: -9.7, longitude: 119.3, zoom: 9 }}
                style={{ width: '100%', height: '70vh' }}
                mapStyle={esriSatellite}
                interactiveLayerIds={['desa-fill']}
                onClick={handleClick}
                onMouseMove={handleMapInteraction}
                onMouseLeave={() => setHoverInfo(null)}
              >
                <NavigationControl position="bottom-right" />
                {data && (
                  <Source id="desa" type="geojson" data={data}>
                    <Layer {...fillLayer} />
                    <Layer {...outlineLayer} />
                  </Source>
                )}
                {/* Menampilkan Popup saat hover */}
                {hoverInfo && (
                  <Popup
                    longitude={hoverInfo.longitude}
                    latitude={hoverInfo.latitude}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="top"
                  >
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.orange.dark, fontSize: 15 }}>
                        {hoverInfo.nama}
                      </Typography>
                      {/* Menampilkan teks dari fungsi getPopupText */}
                      {getPopupText(selectedIndicator, hoverInfo.value)}
                    </Paper>
                  </Popup>
                )}
              </Map>

              {/* Tombol Reset & Toggle Legend */}
              <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2, display: 'flex', gap: 1 }}>
                <Tooltip title="Reset Peta">
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: theme.palette.secondary.light } }}
                    onClick={() => {
                      if (mapRef.current && allData) {
                        const allCoords = allData.features.flatMap((f) =>
                          f.geometry.type === 'Polygon'
                            ? f.geometry.coordinates[0]
                            : f.geometry.type === 'MultiPolygon'
                              ? f.geometry.coordinates.flat(2)
                              : []
                        );
                        if (allCoords.length > 0) {
                          const lons = allCoords.map((c) => c[0]);
                          const lats = allCoords.map((c) => c[1]);
                          mapRef.current.fitBounds(
                            [
                              [Math.min(...lons), Math.min(...lats)],
                              [Math.max(...lons), Math.max(...lats)]
                            ],
                            { padding: 50, duration: 1000 }
                          );
                        }
                        setSelectedKec('all');
                        setSelectedFeature(null);
                      }
                    }}
                  >
                    <MyLocationIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Legenda">
                  <IconButton
                    size="small"
                    sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: theme.palette.secondary.light } }}
                    onClick={() => setShowLegend(!showLegend)}
                  >
                    <LayersIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Legend Box */}
              {showLegend && (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: 60,
                    right: 10,
                    zIndex: 2,
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 'bold', mb: 1, pb: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
                  >
                    {legendTitles[selectedIndicator] || 'Legenda'}
                  </Typography>
                  {palette.map((color, idx) => {
                    const lower = minVal + step * idx;
                    const upper = minVal + step * (idx + 1);
                    let label = '';
                    if (idx === 0) {
                      label = `≤ ${upper.toFixed(0)}`;
                    } else if (idx === palette.length - 1) {
                      label = `≥ ${lower.toFixed(0)}`;
                    } else {
                      label = `${lower.toFixed(0)} - ${upper.toFixed(0)}`;
                    }

                    return (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            mr: 1.5,
                            borderRadius: '4px',
                            border: `1px solid ${theme.palette.grey[400]}`
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Paper>
              )}
            </Box>

            {/* Menampilkan Sumber Data yang Diambil dari JSON */}
            {sumberData.length > 0 && (
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="body2" align="left" fontStyle="italic">
                  Sumber: {sumberData.join(', ')}
                </Typography>
              </Paper>
            )}
          </CardContent>
        </MainCard>
      )}
    </>
  );
}
