// StackedPengeluaranCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedPengeluaranCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [kategoriList, setKategoriList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setKategoriList([]);
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
    data.forEach((item) => {
      if (item.kategori) {
        kategoriSet.add(String(item.kategori).trim());
      }
    });
    const kategoriArr = Array.from(kategoriSet);
    setKategoriList(kategoriArr);

    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const kategori = String(item.kategori).trim();
      const val = toNumber(item['rata-rata pengeluaran (rupiah)']);

      if (!grouped[th]) {
        grouped[th] = { tahun: th, total: 0 };
        kategoriArr.forEach((k) => {
          grouped[th][k] = { persen: 0, asli: 0 };
        });
      }
      grouped[th][kategori].asli += val;
      grouped[th].total += val;
    });

    const result = Object.values(grouped).map((row) => {
      const total = row.total || 1;
      const newRow = { tahun: row.tahun };
      kategoriArr.forEach((k) => {
        const asli = row[k].asli;
        const persen = (asli / total) * 100;
        newRow[k] = persen;
        newRow[`${k}_asli`] = asli;
      });
      return newRow;
    });

    setChartData(result);

    if (data.length > 0 && data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data]);

  const colors = [theme.palette.info.main, theme.palette.secondary.main];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => {
              const asli = entry.payload[`${entry.name}_asli`] || 0;
              return (
                <li key={idx} style={{ color: entry.color }}>
                  {entry.name}: {entry.value.toFixed(2).replace('.', ',')} % (Rp {asli.toLocaleString('id-ID')})
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  // buka modal
  const handleBarClick = (data, kategori) => {
    if (!data) return;
    const persen = data[kategori]?.toFixed(2) || 0;
    const asli = data[`${kategori}_asli`] || 0;
    setModalContent({
      tahun: data.tahun,
      kategori,
      persen,
      asli
    });
    setModalOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          //   border: (theme) => `2px solid ${theme.palette.grey[200]}`,
          borderRadius: 2,
          height: '100%'
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
            Persentase Rata-Rata Pengeluaran Per Kapita (Per Orang) Sebulan menurut Kelompok Komoditas di Kabupaten Sumba Barat
          </Typography>

          <Box sx={{ flex: 1, minHeight: 300 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <XAxis dataKey="tahun" />
                  <YAxis domain={[0, 100]} tickFormatter={(val) => `${val.toFixed(0)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />
                  {kategoriList.map((kategori, idx) => (
                    <Bar
                      key={kategori}
                      dataKey={kategori}
                      stackId="a"
                      fill={colors[idx % colors.length]}
                      name={kategori}
                      onClick={(d) => handleBarClick(d, kategori)}
                      cursor="pointer"
                    >
                      <LabelList
                        dataKey={kategori}
                        position="center"
                        formatter={(val) => `${val.toFixed(1)}%`}
                        style={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>

          {sumber && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic' }}>
              Sumber: {sumber}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal interpretasi */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Interpretasi</DialogTitle>
        <DialogContent dividers>
          {modalContent && (
            <Typography variant="body1">
              Pada tahun <strong>{modalContent.tahun}</strong>,<strong> rata-rata pengeluaran per orang sebulan </strong> untuk kelompok
              komoditas <strong>{modalContent.kategori}</strong> di Kabupaten Sumba Barat sebesar{' '}
              <strong>Rp{modalContent.asli.toLocaleString('id-ID')}</strong>, menyumbang <strong>{modalContent.persen}%</strong> dari total
              pengeluaran.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

StackedPengeluaranCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
