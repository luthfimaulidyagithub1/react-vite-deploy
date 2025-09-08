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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function LajuPDRBPengeluaranCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [sumber, setSumber] = useState('');
  const [catatanByTahun, setCatatanByTahun] = useState({}); // State baru untuk catatan
  const [selectedJenis, setSelectedJenis] = useState([]);

  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [tahunList, setTahunList] = useState([]);

  const [chartType, setChartType] = useState('line');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const chartHeight = isMobile ? 280 : isTablet ? 400 : 500;

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setJenisList([]);
      setSumber('');
      setCatatanByTahun({}); // Reset catatan
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

    const jenisSet = new Set();
    const catatanMap = {}; // Objek untuk menyimpan catatan per tahun

    data.forEach((item) => {
      if (item['jenis pengeluaran']) {
        jenisSet.add(String(item['jenis pengeluaran']).trim());
      }
      // Logika untuk menyimpan catatan
      if (item.tahun && item.catatan && item.catatan.trim() !== '-' && item.catatan.trim() !== '') {
        catatanMap[item.tahun] = item.catatan;
      }
    });

    const jenisArr = Array.from(jenisSet);
    setJenisList(jenisArr);
    if (selectedJenis.length === 0) setSelectedJenis(jenisArr);

    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const jenis = String(item['jenis pengeluaran']).trim();
      const val = toNumber(item['laju pertumbuhan PDRB ADHK']);

      if (!grouped[th]) {
        grouped[th] = { tahun: th };
        jenisArr.forEach((j) => {
          grouped[th][j] = 0;
        });
      }
      grouped[th][jenis] = val;
    });

    const result = Object.values(grouped);
    setChartData(result);
    setCatatanByTahun(catatanMap); // Set state catatan

    const tahunArr = result.map((d) => d.tahun).sort();
    setTahunList(tahunArr);
    if (!tahunAwal && tahunArr.length > 0) setTahunAwal(tahunArr[0]);
    if (!tahunAkhir && tahunArr.length > 0) setTahunAkhir(tahunArr[tahunArr.length - 1]);

    if (data.length > 0 && data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data]);

  const filteredChartData = chartData.filter((d) => (!tahunAwal || d.tahun >= tahunAwal) && (!tahunAkhir || d.tahun <= tahunAkhir));

  // Filter catatan berdasarkan rentang tahun
  const filteredCatatan = Object.entries(catatanByTahun).filter(([tahun]) => {
    return (!tahunAwal || tahun >= tahunAwal) && (!tahunAkhir || tahun <= tahunAkhir);
  });

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => (
              <li key={idx} style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
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
          Jenis Pengeluaran
        </Typography>
      </Box>
      <Box sx={{ pb: 2, pt: 1, pl: 2, pr: 2 }}>
        {selectedJenis.map((jenis, idx) => {
          const color = colors[idx % colors.length];
          return (
            <Box key={jenis} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ minWidth: 14, height: 14, bgcolor: color, borderRadius: 0.5, mr: 1 }} />
              <Typography variant="caption">{jenis}</Typography>
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
          Laju Pertumbuhan PDRB ADHK Menurut Jenis Pengeluaran di Kabupaten Sumba Barat
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 300 }}>
            <InputLabel id="kategori-select-label" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
              Pilih Jenis Pengeluaran
            </InputLabel>
            <Select
              labelId="jenis-select-label"
              multiple
              value={selectedJenis}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes('ALL')) {
                  if (selectedJenis.length === jenisList.length) {
                    setSelectedJenis([]);
                  } else {
                    setSelectedJenis(jenisList);
                  }
                } else {
                  setSelectedJenis(value);
                }
              }}
              input={<OutlinedInput label="Pilih Jenis Pengeluaran" />}
              renderValue={(selected) => selected.map((val) => jenisList.indexOf(val) + 1).join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem
                value="ALL"
                disableRipple
                sx={{
                  bgcolor: selectedJenis.length === jenisList.length ? 'error.light' : 'success.light',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: selectedJenis.length === jenisList.length ? 'error.light' : 'success.light'
                  }
                }}
              >
                <Checkbox
                  indeterminate={selectedJenis.length > 0 && selectedJenis.length < jenisList.length}
                  checked={jenisList.length > 0 && selectedJenis.length === jenisList.length}
                  sx={{ color: selectedJenis.length === jenisList.length ? 'error.main' : 'success.main' }}
                />
                <ListItemText primary={selectedJenis.length === jenisList.length ? 'Hapus Semua Jenis' : 'Pilih Semua Jenis'} />
              </MenuItem>
              {jenisList.map((jenis) => (
                <MenuItem key={jenis} value={jenis}>
                  <Checkbox checked={selectedJenis.indexOf(jenis) > -1} />
                  <ListItemText primary={jenis} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="chart-type-label">Jenis Grafik</InputLabel>
            <Select labelId="chart-type-label" value={chartType} label="Jenis Grafik" onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
          </FormControl>

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

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: chartHeight }}>
          <CustomLegend />
          <Box sx={{ flex: 1, minHeight: chartHeight }}>
            {filteredChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === 'line' ? (
                  <LineChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="tahun" />
                    <YAxis
                      tickFormatter={(val) => `${val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`}
                      width={isMobile ? 70 : 100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedJenis.map((jenis, idx) => (
                      <Line
                        key={jenis}
                        type="monotone"
                        dataKey={jenis}
                        stroke={colors[idx % colors.length]}
                        name={jenis}
                        dot={{ r: 3, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                        activeDot={{ r: 5, fill: colors[idx % colors.length], stroke: colors[idx % colors.length] }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="tahun" />
                    <YAxis tickFormatter={(val) => `${val.toFixed(1)} %`} width={isMobile ? 70 : 100} />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedJenis.map((jenis, idx) => (
                      <Bar key={jenis} dataKey={jenis} fill={colors[idx % colors.length]} name={jenis} barSize={isMobile ? 20 : 40} />
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

        {/* Bagian Catatan yang Diperbarui */}
        {filteredCatatan.length > 0 ? (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'left', fontStyle: 'italic' }}>
              Catatan:
            </Typography>
            {filteredCatatan.map(([tahun, cttn]) => (
              <Typography key={tahun} variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'left' }}>
                {tahun} {cttn}
              </Typography>
            ))}
          </>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'left', fontStyle: 'italic' }}>
            Catatan: -
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

LajuPDRBPengeluaranCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
