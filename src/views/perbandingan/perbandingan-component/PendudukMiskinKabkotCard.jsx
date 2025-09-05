// PendudukMiskinKabkotCard.jsx
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
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function PendudukMiskinKabkotCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [idList, setIdList] = useState([]);
  const [idMap, setIdMap] = useState({});
  const [sumber, setSumber] = useState('');
  const [selectedId, setSelectedId] = useState([]);
  const [chartType, setChartType] = useState('line');

  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [tahunList, setTahunList] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const chartHeight = isMobile ? 280 : isTablet ? 400 : 500;

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setIdList([]);
      setIdMap({});
      setSumber('');
      return;
    }

    // 🔹 Filter supaya "Nusa Tenggara Timur" tidak ikut masuk
    const filteredData = data.filter((item) => String(item.kabkot).trim() !== 'Nusa Tenggara Timur');

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const idSet = new Set();
    const map = {};
    filteredData.forEach((item) => {
      if (item.id && item.kabkot) {
        const id = String(item.id).trim();
        const kabkot = String(item.kabkot).trim();
        idSet.add(id);
        map[id] = kabkot;
      }
    });
    const idArr = Array.from(idSet);
    setIdList(idArr);
    setIdMap(map);
    if (selectedId.length === 0) setSelectedId(idArr);

    // Group data by tahun
    const grouped = {};
    filteredData.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const id = String(item.id).trim();
      const val = toNumber(item['penduduk miskin']);

      if (!grouped[th]) {
        grouped[th] = { tahun: th };
        idArr.forEach((k) => {
          grouped[th][k] = 0;
        });
      }
      grouped[th][id] = val;
    });

    const result = Object.values(grouped);
    setChartData(result);

    const tahunArr = result.map((d) => d.tahun).sort();
    setTahunList(tahunArr);
    if (!tahunAwal && tahunArr.length > 0) setTahunAwal(tahunArr[0]);
    if (!tahunAkhir && tahunArr.length > 0) setTahunAkhir(tahunArr[tahunArr.length - 1]);

    if (filteredData.length > 0 && filteredData[0].sumber) {
      setSumber(filteredData[0].sumber);
    }
  }, [data]);

  const filteredChartData = chartData.filter((d) => (!tahunAwal || d.tahun >= tahunAwal) && (!tahunAkhir || d.tahun <= tahunAkhir));

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => (
              <li key={idx} style={{ color: entry.color }}>
                {entry.name}:{' '}
                {entry.value.toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}{' '}
                ribu
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <Paper
      elevation={1}
      sx={{
        p: 0,
        mt: isMobile ? 2 : 0,
        mb: isMobile ? 2 : 0,
        flex: isMobile ? '0 0 auto' : '0 0 220px',
        maxHeight: chartHeight - 30,
        overflowY: 'auto',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 2,
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Kabupaten/Kota
        </Typography>
      </Box>
      <Box sx={{ pb: 2, pt: 1, pl: 2, pr: 2 }}>
        {selectedId.map((id, idx) => {
          const color = colors[idx % colors.length];
          const kabkot = idMap[id] || id;
          return (
            <Box key={id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ minWidth: 14, height: 14, bgcolor: color, borderRadius: 0.5, mr: 1 }} />
              <Typography variant="caption">
                {id} ({kabkot})
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Jumlah Penduduk Miskin (Ribu) Menurut Kabupaten/Kota di Provinsi Nusa Tenggara Timur
        </Typography>

        {/* Dropdowns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap'
          }}
        >
          {/* Pilih kab/kot */}
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : '100%' }}>
            <InputLabel id="id-select-label">Pilih Kabupaten/Kota</InputLabel>
            <Select
              labelId="id-select-label"
              multiple
              value={selectedId}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes('ALL')) {
                  if (selectedId.length === idList.length) {
                    setSelectedId([]);
                  } else {
                    setSelectedId(idList);
                  }
                } else {
                  setSelectedId(value);
                }
              }}
              input={<OutlinedInput label="Pilih Kabupaten/Kota" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem
                value="ALL"
                disableRipple
                sx={{
                  bgcolor: selectedId.length === idList.length ? 'error.light' : 'success.light',
                  borderRadius: 1,
                  '&:hover': { bgcolor: selectedId.length === idList.length ? 'error.light' : 'success.light' }
                }}
              >
                <Checkbox
                  indeterminate={selectedId.length > 0 && selectedId.length < idList.length}
                  checked={idList.length > 0 && selectedId.length === idList.length}
                />
                <ListItemText primary={selectedId.length === idList.length ? 'Hapus Semua' : 'Pilih Semua'} />
              </MenuItem>
              {idList.map((id) => (
                <MenuItem key={id} value={id}>
                  <Checkbox checked={selectedId.indexOf(id) > -1} />
                  <ListItemText primary={`${id} (${idMap[id] || id})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown jenis grafik */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="chart-type-label">Jenis Grafik</InputLabel>
            <Select labelId="chart-type-label" value={chartType} label="Jenis Grafik" onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
          </FormControl>

          {/* Tahun Awal */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="tahun-awal-label">Tahun Awal</InputLabel>
            <Select
              labelId="tahun-awal-label"
              value={tahunAwal}
              label="Tahun Awal"
              onChange={(e) => {
                const newTahunAwal = e.target.value;
                setTahunAwal(newTahunAwal);
                if (tahunAkhir && tahunAkhir <= newTahunAwal) {
                  setTahunAkhir('');
                }
              }}
            >
              {tahunList.map((th) => (
                <MenuItem key={th} value={th}>
                  {th}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tahun Akhir */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="tahun-akhir-label">Tahun Akhir</InputLabel>
            <Select labelId="tahun-akhir-label" value={tahunAkhir} label="Tahun Akhir" onChange={(e) => setTahunAkhir(e.target.value)}>
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

        {/* Chart + Legend */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: chartHeight }}>
          <CustomLegend />
          <Box sx={{ flex: 1, minHeight: chartHeight }}>
            {filteredChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === 'line' ? (
                  <LineChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="tahun" />
                    <YAxis
                      tickFormatter={(val) => val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      width={isMobile ? 50 : 70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedId.map((id, idx) => (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        stroke={colors[idx % colors.length]}
                        name={id}
                        dot={{ r: 3, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                        activeDot={{ r: 5, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="tahun" />
                    <YAxis
                      tickFormatter={(val) => val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      width={isMobile ? 50 : 70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedId.map((id, idx) => (
                      <Bar key={id} dataKey={id} fill={colors[idx % colors.length]} name={id} barSize={isMobile ? 20 : 40} />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>
        </Box>

        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

PendudukMiskinKabkotCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
