// src/ui-component/cards/statistik/PengeluaranBukanBukanMakananBarLineCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Skeleton, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ResponsiveContainer, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';

export default function PengeluaranBukanBukanMakananBarLineCard({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // Kelompokkan per tahun
    const grouped = data.reduce((acc, item) => {
      const tahun = item.tahun;
      const pengeluaran = Number(item['rata-rata pengeluaran (rupiah)']) || 0;
      const kategori = item.kategori;
      const sumber = item.sumber || null;

      if (!acc[tahun]) {
        acc[tahun] = { tahun, totalSemua: 0, totalBukanMakanan: 0, sumber };
      }

      acc[tahun].totalSemua += pengeluaran;
      if (kategori.toLowerCase() === 'bukan makanan') {
        acc[tahun].totalBukanMakanan += pengeluaran;
      }
      return acc;
    }, {});

    // Hitung persentase
    const result = Object.values(grouped).map((d) => ({
      tahun: d.tahun,
      rata: d.totalBukanMakanan,
      persen: d.totalSemua > 0 ? (d.totalBukanMakanan / d.totalSemua) * 100 : 0,
      sumber: d.sumber
    }));

    setChartData(result);
    if (result.length > 0) setSumber(result[0].sumber || null);
  }, [data]);

  // format angka rupiah
  const formatRupiah = (num) => (num != null ? num.toLocaleString('id-ID', { minimumFractionDigits: 0 }) : '-');

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
            {/* Judul */}
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                textAlign: 'center',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Rata-Rata Pengeluaran Per Kapita Sebulan (Rupiah) & Persentase untuk Kelompok Komoditas Bukan Makanan
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(v) => `Rp${(v / 1000).toFixed(0)}k`}
                    stroke={theme.palette.success.dark} // 👈 sama dengan warna Bar
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    stroke={theme.palette.warning.dark} // 👈 sama dengan warna Line
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'Rata-rata pengeluaran per kapita sebulan' ? `Rp${formatRupiah(value)}` : `${value.toFixed(2)}%`
                    }
                  />
                  <Legend />

                  {/* Bar untuk pengeluaran */}
                  <Bar
                    yAxisId="left"
                    dataKey="rata"
                    name="Rata-rata pengeluaran per kapita sebulan"
                    fill={theme.palette.success.dark}
                    barSize={40}
                    cursor="pointer"
                    onClick={(data) => setSelected({ ...data, tipe: 'rata' })}
                  />
                  {/* Line untuk persentase */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="persen"
                    name="Persentase"
                    stroke={theme.palette.warning.dark}
                    strokeWidth={2}
                    dot={(props) => (
                      <circle
                        {...props}
                        r={5}
                        strokeWidth={2}
                        fill={theme.palette.warning.dark}
                        cursor="pointer"
                        onClick={() => setSelected({ ...props.payload, tipe: 'persen' })}
                      />
                    )}
                    activeDot={{
                      r: 6,
                      cursor: 'pointer',
                      onClick: (e, payload) => setSelected({ ...payload.payload, tipe: 'persen' })
                    }}
                    style={{ cursor: 'pointer' }} // 👈 bikin garisnya ikut jadi tangan
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>

            {/* Modal interpretasi */}
            <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
              <DialogTitle>
                Interpretasi
                <IconButton
                  aria-label="close"
                  onClick={() => setSelected(null)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500]
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                {selected?.tipe === 'rata' ? (
                  <Typography>
                    Pada tahun <strong>{selected?.tahun}</strong>, <strong>rata-rata pengeluaran bukan makanan per kapita sebulan </strong>
                    tercatat sebesar <strong>Rp{formatRupiah(selected?.rata)}</strong>.
                  </Typography>
                ) : selected?.tipe === 'persen' ? (
                  <Typography>
                    Pada tahun <strong>{selected?.tahun}</strong>, <strong>pengeluaran bukan makanan per kapita sebulan</strong> menyumbang{' '}
                    <strong>{selected?.persen?.toFixed(2)}%</strong> dari total pengeluaran.
                  </Typography>
                ) : null}
              </DialogContent>
            </Dialog>

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

PengeluaranBukanBukanMakananBarLineCard.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
