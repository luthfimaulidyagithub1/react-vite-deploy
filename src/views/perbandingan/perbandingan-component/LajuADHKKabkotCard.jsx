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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Konstanta warna untuk chart Bar/Line
const colors = [
  '#1f77b4', // biru
  '#ff7f0e', // oranye
  '#2ca02c', // hijau
  '#d62728', // merah
  '#9467bd', // ungu
  '#8c564b', // coklat
  '#e377c2', // merah muda
  '#7f7f7f', // abu-abu
  '#bcbd22', // zaitun
  '#17becf', // biru muda
  '#aec7e8', // biru pastel
  '#ffbb78', // oranye pastel
  '#98df8a', // hijau pastel
  '#ff9896', // merah pastel
  '#c5b0d5', // ungu pastel
  '#c49c94', // coklat pastel
  '#f7b6d2', // merah muda pastel
  '#c7c7c7', // abu-abu muda
  '#dbdb8d', // zaitun pastel
  '#9edae5', // biru muda pastel
  '#393b79', // biru tua
  '#637939', // hijau tua
  '#8c6d31', // coklat tua
  '#843c39', // merah tua
  '#7b4173' // ungu tua
];

export default function LajuADHKKabkotCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [idList, setIdList] = useState([]);
  const [kabkotMap, setKabkotMap] = useState({});
  const [colorMap, setColorMap] = useState({});
  const [sumber, setSumber] = useState('');
  const [catatanByTahun, setCatatanByTahun] = useState({});
  const [chartType, setChartType] = useState('line');
  const [selectedId, setSelectedId] = useState([]);
  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [tahunList, setTahunList] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const chartHeight = 500;

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setIdList([]);
      setKabkotMap({});
      setColorMap({});
      setSumber('');
      setCatatanByTahun({});
      setTahunList([]);
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

    const idSet = new Set();
    const kabkotSet = new Set();
    const tahunSet = new Set();
    const map = {};
    const catatanMap = {};

    // Filter data untuk mengecualikan Nusa Tenggara Timur
    const filteredData = data.filter((item) => {
      const kabkot = String(item.kabkot || '')
        .trim()
        .toLowerCase();
      const id = String(item.id || '')
        .trim()
        .toLowerCase();
      return kabkot !== 'nusa tenggara timur' && id !== 'ntt';
    });

    filteredData.forEach((item) => {
      const id = String(item.id).trim();
      const kabkot = String(item.kabkot).trim();
      const tahun = String(item.tahun).trim();

      idSet.add(id);
      kabkotSet.add(kabkot);
      tahunSet.add(tahun);
      map[id] = kabkot;

      if (tahun && item.catatan && item.catatan.trim() !== '-') {
        catatanMap[tahun] = item.catatan;
      }
    });

    const idArr = Array.from(idSet);
    const kabkotArr = Array.from(kabkotSet);
    const tahunArr = Array.from(tahunSet).sort();

    const newColorMap = {};
    idArr.forEach((id, index) => {
      newColorMap[id] = colors[index % colors.length];
    });

    setIdList(idArr);
    setKabkotMap(map);
    setColorMap(newColorMap);
    setTahunList(tahunArr);

    if (tahunArr.length > 0) {
      if (!tahunAwal) setTahunAwal(tahunArr[0]);
      if (!tahunAkhir) setTahunAkhir(tahunArr[tahunArr.length - 1]);
    }

    // Prepare data for Line/Bar Chart
    const grouped = {};
    filteredData.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const id = String(item.id).trim();
      const val = toNumber(item['Laju ADHK 2010']);
      if (!grouped[th]) {
        grouped[th] = { tahun: th };
      }
      grouped[th][id] = val;
    });
    setChartData(Object.values(grouped));
    setCatatanByTahun(catatanMap);

    if (filteredData.length > 0 && filteredData[0].sumber) {
      setSumber(filteredData[0].sumber);
    }
    if (selectedId.length === 0 && idArr.length > 0) {
      setSelectedId(idArr);
    }
  }, [data, tahunAwal, tahunAkhir]);

  const filteredChartData = chartData.filter((d) => (!tahunAwal || d.tahun >= tahunAwal) && (!tahunAkhir || d.tahun <= tahunAkhir));

  const filteredCatatan = Object.entries(catatanByTahun).filter(
    ([tahun]) => (!tahunAwal || tahun >= tahunAwal) && (!tahunAkhir || tahun <= tahunAkhir)
  );

  // Custom Tooltip for Recharts
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
                  {kabkotMap[entry.name] || entry.name}:{' '}
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

  const RenderClickedTooltip = () => {
    if (!activeTooltip) return null;
    const tahun = activeTooltip.tahun;
    const payload = Object.keys(activeTooltip)
      .filter((key) => selectedId.includes(key) && key !== 'tahun')
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

  const CustomLegend = () => {
    const handleCheckAll = () => {
      setSelectedId(selectedId.length === idList.length ? [] : idList);
    };

    const handleCheckItem = (id) => {
      setSelectedId(selectedId.includes(id) ? selectedId.filter((x) => x !== id) : [...selectedId, id]);
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
          Kabupaten/Kota
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
          <ListItem onClick={handleCheckAll} sx={{ cursor: 'pointer' }}>
            <ListItemIcon sx={{ minWidth: 26 }}>
              <Checkbox
                size="small"
                indeterminate={selectedId.length > 0 && selectedId.length < idList.length}
                checked={idList.length > 0 && selectedId.length === idList.length}
              />
            </ListItemIcon>
            <ListItemText
              primary={selectedId.length === idList.length ? 'Semua Kab/Kota' : 'Pilih Semua'}
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
          {idList.map((id) => (
            <ListItem key={id} onClick={() => handleCheckItem(id)} sx={{ cursor: 'pointer' }}>
              <ListItemIcon sx={{ minWidth: 26 }}>
                <Checkbox
                  size="small"
                  checked={selectedId.includes(id)}
                  sx={{
                    color: colorMap[id],
                    '&.Mui-checked': { color: colorMap[id] }
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={kabkotMap[id] || id}
                secondary={`ID: ${id}`}
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 4, textAlign: 'center', color: theme.palette.primary.dark }}>
          Laju Pertumbuhan Produk Domestik Regional Bruto (PDRB) Atas Dasar Harga Konstan (ADHK) 2010 Menurut Kabupaten/Kota di Provinsi
          Nusa Tenggara Timur
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
            <InputLabel>Jenis Grafik</InputLabel>
            <Select value={chartType} label="Jenis Grafik" onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
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

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: chartHeight }}>
          <CustomLegend />
          <Box sx={{ flex: 1, ml: isMobile ? 0 : 2, mt: isMobile ? 2 : 0 }}>
            {filteredChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={chartHeight}>
                  {chartType === 'line' ? (
                    <LineChart data={filteredChartData} onClick={handleChartClick}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tahun" />
                      <YAxis tickFormatter={(val) => `${val.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`} />
                      <Tooltip content={<CustomTooltip />} trigger="none" />
                      {selectedId.map((id) => (
                        <Line
                          key={id}
                          type="monotone"
                          dataKey={id}
                          stroke={colorMap[id]}
                          dot={{ r: 3 }}
                          activeDot={{ r: 4 }}
                          name={kabkotMap[id]}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={filteredChartData} onClick={handleChartClick} barCategoryGap="0%" barGap={0}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tahun" />
                      <YAxis tickFormatter={(val) => `${val.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`} />
                      <Tooltip content={<CustomTooltip />} trigger="none" />
                      {selectedId.map((id) => (
                        <Bar key={id} dataKey={id} fill={colorMap[id]} name={kabkotMap[id]} />
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

LajuADHKKabkotCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
