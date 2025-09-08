import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Skeleton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// fungsi normalisasi key biar gampang cari field
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

// formatter angka dengan pemisah koma untuk desimal
const formatNumber = (num, decimals = 0) =>
  num != null
    ? num.toLocaleString('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    : '-';

// Komponen Tooltip kustom
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #ccc',
          p: 1
        }}
      >
        <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.primary' }}>
          Tahun {label}
        </Typography>
        {dataPoint.jumlah && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, color: theme.palette.primary.dark }}>
            Jumlah: {formatNumber(dataPoint.jumlah, 2)} ribu jiwa
          </Typography>
        )}
        {dataPoint.persentase && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, color: theme.palette.secondary.main }}>
            Persentase: {formatNumber(dataPoint.persentase, 2)}%
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export default function PendudukMiskinLineCard({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const mapped = data.map((item) => {
      const keys = Object.keys(item || {});
      const jmlKey = keys.find((k) => normalize(k).includes('pendudukmiskin'));
      const persenKey = keys.find((k) => normalize(k).includes('persentase'));
      return {
        tahun: item?.tahun || '',
        jumlah: jmlKey ? parseFloat(item[jmlKey]) : null,
        persentase: persenKey ? parseFloat(item[persenKey]) : null,
        sumber: item?.sumber || null
      };
    });

    const years = mapped.map((item) => item.tahun).filter(Boolean);
    const uniqueYears = [...new Set(years)].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    setAvailableYears(uniqueYears);

    if (uniqueYears.length > 0) {
      setTahunAwal(uniqueYears[0]);
      setTahunAkhir(uniqueYears[uniqueYears.length - 1]);
    }

    setChartData(mapped);
    if (mapped.length > 0) setSumber(mapped[0]?.sumber || null);
  }, [data]);

  useEffect(() => {
    const startIndex = chartData.findIndex((item) => item.tahun === tahunAwal);
    const endIndex = chartData.findIndex((item) => item.tahun === tahunAkhir);

    if (startIndex !== -1 && endIndex !== -1) {
      setFilteredData(chartData.slice(startIndex, endIndex + 1));
    } else {
      setFilteredData(chartData);
    }
  }, [chartData, tahunAwal, tahunAkhir]);

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={300} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={170} />
          </>
        ) : (
          <>
            {/* Judul Chart */}
            <Typography
              variant="h3"
              sx={{
                mb: 4,
                textAlign: 'left',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Jumlah Penduduk Miskin per Tahun
            </Typography>

            {/* Dropdown Filter Tahun */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Tahun Awal</InputLabel>
                <Select value={tahunAwal} label="Tahun Awal" onChange={(e) => setTahunAwal(e.target.value)}>
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year} disabled={parseInt(year, 10) >= parseInt(tahunAkhir, 10)}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Tahun Akhir</InputLabel>
                <Select value={tahunAkhir} label="Tahun Akhir" onChange={(e) => setTahunAkhir(e.target.value)}>
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year} disabled={parseInt(year, 10) <= parseInt(tahunAwal, 10)}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={filteredData} margin={{ top: 20, bottom: 10, right: 20, left: 10 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    orientation="left"
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => formatNumber(value, 2)}
                  />
                  <Tooltip content={<CustomTooltip theme={theme} />} />

                  {/* Line jumlah penduduk miskin */}
                  <Line
                    type="monotone"
                    dataKey="jumlah"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ fill: theme.palette.primary.main, r: 4 }}
                    activeDot={{ stroke: theme.palette.primary.light, strokeWidth: 2, r: 8 }}
                    name="Jumlah Penduduk Miskin"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* sumber */}
            {sumber && (
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  display: 'block',
                  textAlign: 'left',
                  fontStyle: 'italic',
                  color: 'text.secondary'
                }}
              >
                Sumber: {sumber}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

PendudukMiskinLineCard.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
