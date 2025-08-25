// src/ui-component/cards/statistik/IndeksLineChart.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Skeleton, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// fungsi normalisasi key biar gampang cari field
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

export default function IndeksLineChart({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const mapped = data.map((item) => {
      const keys = Object.keys(item || {});
      const kedalamanKey = keys.find((k) => normalize(k).includes('indekskedalamankemiskinan'));
      const keparahanKey = keys.find((k) => normalize(k).includes('indekskeparahankemiskinan'));
      return {
        tahun: item?.tahun || '',
        kedalaman: kedalamanKey ? parseFloat(item[kedalamanKey]) : null,
        keparahan: keparahanKey ? parseFloat(item[keparahanKey]) : null,
        sumber: item?.sumber || null
      };
    });

    setChartData(mapped);
    if (mapped.length > 0) setSumber(mapped[0]?.sumber || null);
  }, [data]);

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
              variant="subtitle1"
              sx={{
                mb: 2,
                textAlign: 'left',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Indeks Kedalaman & Indeks Keparahan Kemiskinan per Tahun
            </Typography>
            {/* Pengertian */}
            <Typography
              variant="body2"
              sx={{
                mb: 5,
                textAlign: 'left',
                color: 'text.secondary'
              }}
            >
              Indeks kedalaman kemiskinan mengukur rata-rata kesenjangan pengeluaran tiap penduduk miskin terhadap garis kemiskinan. Indeks
              keparahan kemiskinan memperhitungkan ketimpangan di antara penduduk miskin itu sendiri.
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ right: 10, left: 10 }}>
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
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={theme.palette.warning.dark}
                          stroke="#fff"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPoint({ ...payload, tipe: 'kedalaman' })}
                        />
                      );
                    }}
                    name="indeks kedalaman"
                  />

                  {/* Line keparahan */}
                  <Line
                    type="monotone"
                    dataKey="keparahan"
                    stroke={theme.palette.error.dark}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={theme.palette.error.dark}
                          stroke="#fff"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPoint({ ...payload, tipe: 'keparahan' })}
                        />
                      );
                    }}
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
