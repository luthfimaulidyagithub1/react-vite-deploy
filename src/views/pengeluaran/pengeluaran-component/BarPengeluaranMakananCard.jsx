// BarPengeluaranMakananCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

export default function BarPengeluaranMakananCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.orange.main,
    '#6A1B9A', // purple
    '#00897B', // teal
    '#D81B60', // pink
    '#5D4037', // brown
    '#455A64', // blue grey
    '#F57C00', // orange deep
    '#FFD600', // yellow
    '#b3ff03ff', // lime green
    '#29B6F6' // light blue
  ];

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun & kategori = Makanan
    let filtered = data.filter((item) => String(item.tahun) === String(tahun) && String(item.kategori).trim() === 'Makanan');

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // transformasi data
    const result = filtered.map((item) => ({
      name: item['kelompok komoditas'] || 'Tidak diketahui',
      nilai: toNumber(item['rata-rata pengeluaran (rupiah)']),
      persen: toNumber(item['persentase'])
    }));

    // urutkan dari pengeluaran tertinggi
    result.sort((a, b) => b.nilai - a.nilai);

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  const formatRupiah = (val) => `Rp ${val.toLocaleString('id-ID')}`;
  const formatPersen = (val) => `${val.toFixed(2).replace('.', ',')}%`;

  return (
    <Card sx={{ borderRadius: 2, height: '100%', border: (theme) => `2px solid ${theme.palette.grey[100]}` }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Rata-Rata Pengeluaran Per Kapita (Per Orang) Sebulan untuk Kelompok Komoditas Makanan di Kabupaten Sumba Barat, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 60, left: 0, bottom: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(val) => `Rp${val.toLocaleString('id-ID')}`} />
              <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = chartData.find((d) => d.name === label);
                    if (!item) return null;
                    return (
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #ccc',
                          padding: '8px',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}
                      >
                        <strong>{label}</strong>
                        <br />
                        Rata-rata pengeluaran: Rp{item.nilai.toLocaleString('id-ID')}
                        <br />
                        Persentase: {item.persen.toFixed(2).replace('.', ',')}%
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar dataKey="nilai" name="Pengeluaran">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  content={(props) => {
                    const { x, y, width, height, value, index } = props;
                    const persen = chartData[index]?.persen || 0;
                    return (
                      <text x={x + width + 5} y={y + height / 2} dy={3} fontSize={11} fontWeight={600} fill={theme.palette.text.primary}>
                        Rp{value.toLocaleString('id-ID')}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Belum ada data
          </Typography>
        )}

        {sumber && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
              textAlign: 'left',
              fontStyle: 'italic'
            }}
          >
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

BarPengeluaranMakananCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
