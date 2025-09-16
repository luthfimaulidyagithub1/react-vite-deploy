import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  ListItemIcon,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Konstanta warna
const colors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#8400ffff',
  '#791400ff',
  '#ff00b3ff',
  '#6e6e6eff',
  '#f2f200ff',
  '#004c54ff',
  '#6d6fafff',
  '#61fe69ff',
  '#bc810dff',
  '#f09592ff',
  '#5a174eff',
  '#00223bff',
  '#bd275bff'
];

export default function LajuPDRBLapusCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [colorMap, setColorMap] = useState({});
  const [sumber, setSumber] = useState('');
  const [catatanByTahun, setCatatanByTahun] = useState({});
  const [chartType, setChartType] = useState('line');
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [tahunList, setTahunList] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const chartHeight = 400;

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setKategoriList([]);
      setKategoriMap({});
      setColorMap({});
      setSumber('');
      setCatatanByTahun({});
      return;
    }

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const kategoriSet = new Set();
    const map = {};
    const catatanMap = {};

    data.forEach((item) => {
      if (item.kategori && item['lapangan usaha']) {
        const kat = String(item.kategori).trim();
        const lap = String(item['lapangan usaha']).trim();
        kategoriSet.add(kat);
        map[kat] = lap;
      }
      if (item.tahun && item.catatan && item.catatan.trim() !== '-') {
        catatanMap[item.tahun] = item.catatan;
      }
    });

    const kategoriArr = Array.from(kategoriSet);
    const newColorMap = {};
    kategoriArr.forEach((kat, index) => {
      newColorMap[kat] = colors[index % colors.length];
    });

    setKategoriList(kategoriArr);
    setKategoriMap(map);
    setColorMap(newColorMap);
    if (selectedKategori.length === 0) setSelectedKategori(kategoriArr);

    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const kat = String(item.kategori).trim();
      // Mengambil data dari field 'laju pertumbuhan PDRB ADHK'
      const val = toNumber(item['laju pertumbuhan PDRB ADHK']);

      if (!grouped[th]) {
        grouped[th] = { tahun: th };
      }
      grouped[th][kat] = val;
    });

    const result = Object.values(grouped);
    setChartData(result);
    setCatatanByTahun(catatanMap);

    const tahunArr = result.map((d) => d.tahun).sort();
    setTahunList(tahunArr);
    if (tahunArr.length > 0) {
      if (!tahunAwal) setTahunAwal(tahunArr[0]);
      if (!tahunAkhir) setTahunAkhir(tahunArr[tahunArr.length - 1]);
    }

    if (data.length > 0 && data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data]);

  const filteredChartData = chartData.filter((d) => (!tahunAwal || d.tahun >= tahunAwal) && (!tahunAkhir || d.tahun <= tahunAkhir));
  const filteredCatatan = Object.entries(catatanByTahun).filter(
    ([tahun]) => (!tahunAwal || tahun >= tahunAwal) && (!tahunAkhir || tahun <= tahunAkhir)
  );

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label, onClose }) => {
    if (active && payload && payload.length) {
      const sortedPayload = payload.filter((entry) => (entry.value ?? 0) !== 0).sort((a, b) => b.value - a.value);

      return (
        <Paper elevation={3} sx={{ p: 1.5, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}
          >
            <Typography variant="body2" component="div">
              <strong>{label}</strong>
            </Typography>
            {onClose && (
              <IconButton size="small" onClick={onClose} sx={{ ml: 1 }} aria-label="close">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {sortedPayload.map((entry) => (
              <li
                key={entry.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '4px 0'
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: entry.color,
                    borderRadius: '50%',
                    mr: 1.5
                  }}
                />
                <Typography variant="caption">
                  {entry.name}:{' '}
                  {(entry.value ?? 0).toLocaleString('id-ID', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  %
                </Typography>
              </li>
            ))}
          </ul>
        </Paper>
      );
    }
    return null;
  };

  // Tooltip manual berdasarkan state klik
  const RenderClickedTooltip = () => {
    if (!activeTooltip) return null;
    const tahun = activeTooltip.tahun;
    const payload = Object.keys(activeTooltip)
      .filter((key) => selectedKategori.includes(key) && key !== 'tahun')
      .map((key) => ({
        name: key,
        color: colorMap[key],
        value: activeTooltip[key]
      }));

    return (
      <Box sx={{ mt: 2 }}>
        <CustomTooltip active={true} payload={payload} label={tahun} onClose={() => setActiveTooltip(null)} />
      </Box>
    );
  };

  // Handler klik chart
  const handleChartClick = (e) => {
    if (e && e.activePayload && e.activePayload[0]) {
      const clickedData = e.activePayload[0].payload;
      if (activeTooltip && activeTooltip.tahun === clickedData.tahun) {
        setActiveTooltip(null);
      } else {
        setActiveTooltip(clickedData);
      }
    }
  };

  // CustomLegend (versi modern)
  const CustomLegend = () => {
    const handleCheckAll = () => {
      setSelectedKategori(selectedKategori.length === kategoriList.length ? [] : kategoriList);
    };

    const handleCheckItem = (kat) => {
      setSelectedKategori(selectedKategori.includes(kat) ? selectedKategori.filter((x) => x !== kat) : [...selectedKategori, kat]);
    };

    return (
      <Paper
        elevation={0}
        sx={{
          flex: isMobile ? '0 0 auto' : '0 0 240px',
          maxHeight: chartHeight - 30,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            p: 1,
            fontWeight: 600,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}
        >
          Kategori Lapangan Usaha
        </Typography>

        <List
          dense
          sx={{
            p: 0,
            flex: 1,
            overflowY: 'auto',
            '& .MuiListItem-root': {
              py: 0.3,
              borderBottom: '1px solid',
              borderColor: 'divider',
              transition: 'background-color 0.2s ease',
              '&:last-of-type': { borderBottom: 'none' },
              '&:hover': { bgcolor: 'action.hover' }
            }
          }}
        >
          {/* Pilih semua */}
          <ListItem onClick={handleCheckAll} sx={{ cursor: 'pointer' }}>
            <ListItemIcon sx={{ minWidth: 26 }}>
              <Checkbox
                size="small"
                indeterminate={selectedKategori.length > 0 && selectedKategori.length < kategoriList.length}
                checked={kategoriList.length > 0 && selectedKategori.length === kategoriList.length}
              />
            </ListItemIcon>
            <ListItemText
              primary={selectedKategori.length === kategoriList.length ? 'Semua Kategori' : 'Pilih Semua'}
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>

          {/* Item kategori */}
          {kategoriList.map((kat) => (
            <ListItem key={kat} onClick={() => handleCheckItem(kat)} sx={{ cursor: 'pointer' }}>
              <ListItemIcon sx={{ minWidth: 26 }}>
                <Checkbox
                  size="small"
                  checked={selectedKategori.includes(kat)}
                  sx={{
                    color: colorMap[kat],
                    '&.Mui-checked': { color: colorMap[kat] }
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={kat}
                secondary={kategoriMap[kat] || kat}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 4, textAlign: 'center', color: theme.palette.orange.dark }}>
          Laju Pertumbuhan Produk Domestik Regional Bruto (PDRB) Atas Dasar Harga Konstan (ADHK) 2010 Menurut Lapangan Usaha di Kabupaten
          Sumba Barat
        </Typography>

        {/* Filter */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
            <InputLabel>Jenis Grafik</InputLabel>
            <Select value={chartType} label="Jenis Grafik" onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel>Tahun Awal</InputLabel>
            <Select
              value={tahunAwal}
              label="Tahun Awal"
              onChange={(e) => {
                setTahunAwal(e.target.value);
                if (tahunAkhir && tahunAkhir <= e.target.value) setTahunAkhir('');
              }}
            >
              {tahunList
                .filter((th) => !tahunAkhir || th < tahunAkhir)
                .map((th) => (
                  <MenuItem key={th} value={th}>
                    {th}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel>Tahun Akhir</InputLabel>
            <Select value={tahunAkhir} label="Tahun Akhir" onChange={(e) => setTahunAkhir(e.target.value)}>
              {tahunList
                .filter((th) => th > tahunAwal)
                .map((th) => (
                  <MenuItem key={th} value={th}>
                    {th}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {/* Chart */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: chartHeight }}>
          <CustomLegend />
          <Box sx={{ flex: 1, ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0 }}>
            {filteredChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={chartHeight}>
                  {chartType === 'line' ? (
                    <LineChart data={filteredChartData} onClick={handleChartClick}>
                      <XAxis dataKey="tahun" />
                      <YAxis tickFormatter={(val) => `${val.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`} />
                      <Tooltip content={<CustomTooltip />} trigger="none" />
                      {selectedKategori.map((kat) => (
                        <Line key={kat} type="monotone" dataKey={kat} stroke={colorMap[kat]} dot={{ r: 3 }} activeDot={{ r: 4 }} />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={filteredChartData} onClick={handleChartClick} barCategoryGap="0%" barGap={0}>
                      <XAxis dataKey="tahun" />
                      <YAxis tickFormatter={(val) => `${val.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`} />
                      <Tooltip content={<CustomTooltip />} trigger="none" />
                      {selectedKategori.map((kat) => (
                        <Bar key={kat} dataKey={kat} fill={colorMap[kat]} name={kat} />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
                <RenderClickedTooltip />
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>
        </Box>

        {/* Sumber & Catatan */}
        {sumber && (
          <Typography variant="caption" sx={{ mt: 1, fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
        {filteredCatatan.length > 0 ? (
          <>
            <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic' }}>
              Catatan:
            </Typography>
            {filteredCatatan.map(([tahun, cttn]) => (
              <Typography key={tahun} variant="caption">
                {tahun} {cttn}
              </Typography>
            ))}
          </>
        ) : (
          <Typography variant="caption" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            Catatan: -
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

LajuPDRBLapusCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
