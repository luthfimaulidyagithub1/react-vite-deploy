// LajuPDRBLapusCard.jsx
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

export default function LajuPDRBLapusCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [sumber, setSumber] = useState('');
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [chartType, setChartType] = useState('line'); // NEW STATE

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
      setKategoriList([]);
      setKategoriMap({});
      setSumber('');
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
    data.forEach((item) => {
      if (item.kategori && item['lapangan usaha']) {
        const kat = String(item.kategori).trim();
        const lap = String(item['lapangan usaha']).trim();
        kategoriSet.add(kat);
        map[kat] = lap;
      }
    });
    const kategoriArr = Array.from(kategoriSet);
    setKategoriList(kategoriArr);
    setKategoriMap(map);
    if (selectedKategori.length === 0) setSelectedKategori(kategoriArr);

    // Grouping data berdasarkan tahun
    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const kat = String(item.kategori).trim();
      const val = toNumber(item['laju pertumbuhan PDRB ADHK']); // ambil laju pertumbuhan (%)

      if (!grouped[th]) {
        grouped[th] = { tahun: th };
        kategoriArr.forEach((k) => {
          grouped[th][k] = 0;
        });
      }
      grouped[th][kat] = val;
    });

    const result = Object.values(grouped);
    setChartData(result);

    // daftar tahun
    const tahunArr = result.map((d) => d.tahun).sort();
    setTahunList(tahunArr);
    if (!tahunAwal && tahunArr.length > 0) setTahunAwal(tahunArr[0]);
    if (!tahunAkhir && tahunArr.length > 0) setTahunAkhir(tahunArr[tahunArr.length - 1]);

    if (data.length > 0 && data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data]);

  // filter sesuai range tahun
  const filteredChartData = chartData.filter((d) => (!tahunAwal || d.tahun >= tahunAwal) && (!tahunAkhir || d.tahun <= tahunAkhir));

  const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
    '#393b79',
    '#637939',
    '#8c6d31',
    '#843c39',
    '#7b4173',
    '#3182bd',
    '#f7b6d2'
  ];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => (
              <li key={idx} style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
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
          Kategori Lapangan Usaha
        </Typography>
      </Box>
      <Box sx={{ pb: 2, pt: 1, pl: 2, pr: 2 }}>
        {selectedKategori.map((kat, idx) => {
          const color = colors[idx % colors.length];
          const lapangan = kategoriMap[kat] || kat;
          return (
            <Box key={kat} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ minWidth: 14, height: 14, bgcolor: color, borderRadius: 0.5, mr: 1 }} />
              <Typography variant="caption">
                {kat} ({lapangan})
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
          Laju Pertumbuhan PDRB ADHK Menurut Lapangan Usaha di Kabupaten Sumba Barat
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
          {/* Pilih kategori */}
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 300 }}>
            <InputLabel id="kategori-select-label" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
              Pilih Kategori Lapangan Usaha
            </InputLabel>{' '}
            <Select
              labelId="kategori-select-label"
              multiple
              value={selectedKategori}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes('ALL')) {
                  if (selectedKategori.length === kategoriList.length) {
                    setSelectedKategori([]);
                  } else {
                    setSelectedKategori(kategoriList);
                  }
                } else {
                  setSelectedKategori(value);
                }
              }}
              input={<OutlinedInput label="Pilih Kategori Lapangan Usaha" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem
                value="ALL"
                disableRipple
                sx={{
                  bgcolor: selectedKategori.length === kategoriList.length ? 'error.light' : 'success.light',
                  borderRadius: 1,
                  '&:hover': { bgcolor: selectedKategori.length === kategoriList.length ? 'error.light' : 'success.light' }
                }}
              >
                <Checkbox
                  indeterminate={selectedKategori.length > 0 && selectedKategori.length < kategoriList.length}
                  checked={kategoriList.length > 0 && selectedKategori.length === kategoriList.length}
                  sx={{ color: selectedKategori.length === kategoriList.length ? 'error.main' : 'success.main' }}
                />
                <ListItemText primary={selectedKategori.length === kategoriList.length ? 'Hapus Semua Kategori' : 'Pilih Semua Kategori'} />
              </MenuItem>
              {kategoriList.map((kat) => (
                <MenuItem key={kat} value={kat}>
                  <Checkbox checked={selectedKategori.indexOf(kat) > -1} />
                  <ListItemText primary={`${kat} (${kategoriMap[kat] || kat})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown chart type */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="chart-type-label">Jenis Grafik</InputLabel>
            <Select labelId="chart-type-label" value={chartType} label="Jenis Grafik" onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
          </FormControl>

          {/* Dropdown tahun awal */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="tahun-awal-label">Tahun Awal</InputLabel>
            <Select
              labelId="tahun-awal-label"
              value={tahunAwal}
              label="Tahun Awal"
              onChange={(e) => {
                const newTahunAwal = e.target.value;
                setTahunAwal(newTahunAwal);

                // kalau tahun akhir <= tahun awal, reset tahun akhir
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

          {/* Dropdown tahun akhir */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="tahun-akhir-label">Tahun Akhir</InputLabel>
            <Select labelId="tahun-akhir-label" value={tahunAkhir} label="Tahun Akhir" onChange={(e) => setTahunAkhir(e.target.value)}>
              {tahunList
                .filter((th) => th > tahunAwal) // hanya tahun lebih besar
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
                      tickFormatter={(val) =>
                        `${val.toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}%`
                      }
                      width={isMobile ? 50 : 70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedKategori.map((kat, idx) => (
                      <Line
                        key={kat}
                        type="monotone"
                        dataKey={kat}
                        stroke={colors[idx % colors.length]}
                        name={kat}
                        dot={{ r: 3, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                        activeDot={{ r: 5, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="tahun" />
                    <YAxis
                      tickFormatter={(val) =>
                        `${val.toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}%`
                      }
                      width={isMobile ? 50 : 70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedKategori.map((kat, idx) => (
                      <Bar key={kat} dataKey={kat} fill={colors[idx % colors.length]} name={kat} barSize={isMobile ? 20 : 40} />
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

LajuPDRBLapusCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
