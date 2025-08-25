// src/ui-component/cards/statistik/GarisKemiskinanLineCard.jsx
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

export default function GarisKemiskinanLineCard({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const mapped = data.map((item) => {
      const keys = Object.keys(item || {});
      const gkKey = keys.find((k) => normalize(k).includes('gariskemiskinan'));
      return {
        tahun: item?.tahun || '',
        nilai: gkKey ? parseFloat(item[gkKey]) : null,
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
                // mt: -2,
                mb: 2,
                textAlign: 'left',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Garis Kemiskinan (Rp) per Tahun
            </Typography>
            {/* Pengertian BPS */}
            <Typography
              variant="body2"
              sx={{
                mb: 5,
                textAlign: 'left',
                color: 'text.secondary'
              }}
            >
              Menurut BPS, garis kemiskinan adalah rata-rata pengeluaran minimum per kapita per bulan untuk memenuhi kebutuhan makanan
              setara 2.100 kilokalori per kapita per hari dan kebutuhan dasar non-makanan (perumahan, sandang, pendidikan, kesehatan, dsb).
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 200 }}>
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
                                  color: theme.palette.primary.dark
                                }}
                              >
                                Garis Kemiskinan: Rp{formatNumber(p.value)}
                              </Typography>
                            ))}
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="nilai"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={theme.palette.primary.main}
                          stroke="#fff"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPoint(payload)} // ✅ simpan point yg diklik
                        />
                      );
                    }}
                    name="garis kemiskinan"
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
                      Garis Kemiskinan: <b>Rp{formatNumber(selectedPoint.nilai)}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Artinya: Pada tahun <b>{selectedPoint.tahun}</b>, rata-rata kebutuhan minimum pengeluaran penduduk yang tidak
                      dikategorikan miskin sebesar <b>Rp{formatNumber(selectedPoint.nilai)}</b>. <br />
                      Penduduk dengan rata-rata pengeluaran per kapita per bulan di bawah angka tersebut dikategorikan sebagai penduduk
                      miskin. Semakin tinggi nilainya, semakin besar biaya hidup minimum yang harus dipenuhi.
                      {/* Nilai ini mencerminkan rata-rata kebutuhan minimum pengeluaran penduduk miskin pada tahun {selectedPoint.tahun}. */}
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

GarisKemiskinanLineCard.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
