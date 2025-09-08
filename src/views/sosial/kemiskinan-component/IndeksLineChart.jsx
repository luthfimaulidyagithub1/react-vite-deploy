import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// fungsi normalisasi key biar gampang cari field
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

// Komponen Dot Kustom dengan area klik lebih besar
const CustomClickableDot = ({ cx, cy, payload, onClick, fillColor }) => {
  return (
    <g>
      {/* Lingkaran transparan yang lebih besar untuk area klik */}
      <circle
        cx={cx}
        cy={cy}
        r={15} // Sesuaikan ukuran radius sesuai kebutuhan
        fill="transparent"
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(payload)}
      />
      {/* Lingkaran utama (dot) yang terlihat */}
      <circle
        cx={cx}
        cy={cy}
        r={5} // Ukuran dot visual
        fill={fillColor}
        stroke="#fff"
        strokeWidth={1}
      />
    </g>
  );
};

export default function IndeksLineChart({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const mapped = data.map((item) => {
      const keys = Object.keys(item || {});
      const kedalamanKey = keys.find((k) => normalize(k).includes('indekskedalaman'));
      const keparahanKey = keys.find((k) => normalize(k).includes('indekskeparahan'));
      return {
        tahun: item?.tahun || '',
        kedalaman: kedalamanKey ? parseFloat(item[kedalamanKey]) : null,
        keparahan: keparahanKey ? parseFloat(item[keparahanKey]) : null,
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
    const startYear = parseInt(tahunAwal, 10);
    const endYear = parseInt(tahunAkhir, 10);

    const filtered = chartData.filter((item) => {
      const itemYear = parseInt(item.tahun, 10);
      return itemYear >= startYear && itemYear <= endYear;
    });

    setFilteredData(filtered);
  }, [chartData, tahunAwal, tahunAkhir]);

  // formatter angka dengan koma dan 2 decimal
  const formatNumber = (num) =>
    num != null
      ? num.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : '-';

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
                mb: 2,
                textAlign: 'left',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Indeks Kedalaman & Indeks Keparahan Kemiskinan Kab. Sumba Barat
            </Typography>
            {/* Pengertian */}
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                textAlign: 'left',
                color: 'text.secondary'
              }}
            >
              <strong>Indeks kedalaman kemiskinan</strong> mengukur rata-rata kesenjangan pengeluaran tiap penduduk miskin terhadap garis
              kemiskinan. <br />
              <strong>Indeks keparahan kemiskinan</strong> memperhitungkan ketimpangan di antara penduduk miskin itu sendiri.
            </Typography>

            {/* Dropdown Filter Tahun */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
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
                <LineChart data={filteredData} margin={{ right: 20, left: 5, top: 30, bottom: 20 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
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
                            {payload.map((p, idx) => (
                              <Typography
                                key={idx}
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  fontWeight: 500,
                                  color: p.dataKey === 'kedalaman' ? theme.palette.warning.dark : theme.palette.error.dark
                                }}
                              >
                                {p.dataKey === 'kedalaman'
                                  ? `Indeks Kedalaman: ${formatNumber(p.value)}`
                                  : `Indeks Keparahan: ${formatNumber(p.value)}`}
                              </Typography>
                            ))}
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Line kedalaman */}
                  <Line
                    type="monotone"
                    dataKey="kedalaman"
                    stroke={theme.palette.warning.dark}
                    strokeWidth={2}
                    dot={
                      <CustomClickableDot
                        fillColor={theme.palette.warning.dark}
                        onClick={(payload) => setSelectedPoint({ ...payload, tipe: 'kedalaman' })}
                      />
                    }
                    name="indeks kedalaman"
                  />

                  {/* Line keparahan */}
                  <Line
                    type="monotone"
                    dataKey="keparahan"
                    stroke={theme.palette.error.dark}
                    strokeWidth={2}
                    dot={
                      <CustomClickableDot
                        fillColor={theme.palette.error.dark}
                        onClick={(payload) => setSelectedPoint({ ...payload, tipe: 'keparahan' })}
                      />
                    }
                    name="indeks keparahan"
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

            {/* Modal interpretasi */}
            <Dialog open={Boolean(selectedPoint)} onClose={() => setSelectedPoint(null)} maxWidth="xs" fullWidth>
              <DialogTitle>Interpretasi Data</DialogTitle>
              <DialogContent>
                {selectedPoint && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Tahun: <b>{selectedPoint.tahun}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedPoint.tipe === 'kedalaman' ? 'Indeks Kedalaman' : 'Indeks Keparahan'}:{' '}
                      <b>{formatNumber(selectedPoint[selectedPoint.tipe])}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPoint.tipe === 'kedalaman'
                        ? `Indeks Kedalaman Kemiskinan menunjukkan seberapa jauh rata-rata pengeluaran penduduk miskin dari garis kemiskinan. Semakin besar nilainya, semakin dalam kondisi kemiskinan.`
                        : `Indeks Keparahan Kemiskinan memperhitungkan ketimpangan di antara penduduk miskin. Semakin tinggi nilainya, semakin besar ketimpangan tingkat kemiskinan.`}
                    </Typography>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedPoint(null)}>Tutup</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}

IndeksLineChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
