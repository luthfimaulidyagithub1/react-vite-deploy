// PiePerkembanganDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

// helper cek warna teks kontras
const getTextColor = (hex) => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#000' : '#fff';
};

// Komponen Tooltip Kustom
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const desaNames = data.desas.join(', ');
    return (
      <Paper elevation={3} sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Jumlah desa/kelurahan {data.name}: {data.value}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Nama desa/kelurahan: {desaNames}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export default function PiePerkembanganDesaCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  // Palet warna konsisten
  const COLORS = [theme.palette.secondary[800], theme.palette.secondary[200], theme.palette.secondary.main];

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    // kelompokkan berdasarkan kategori dan simpan nama desa
    const grouped = {};
    filtered.forEach((item) => {
      const kategori = String(item['tingkat perkembangan deskel']).trim();
      if (!grouped[kategori]) {
        grouped[kategori] = { count: 0, desas: [] };
      }
      grouped[kategori].count += 1;
      grouped[kategori].desas.push(item.deskel);
    });

    const result = Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value: value.count,
      desas: value.desas
    }));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  // custom label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const fillColor = getTextColor(COLORS[index % COLORS.length]);

    return (
      <text x={x} y={y} fill={fillColor} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
        {(percent * 100).toFixed(1)}% ({value})
      </text>
    );
  };

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.grey[200]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Judul */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Distribusi Desa menurut Tingkat Perkembangan Desa di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 280 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* Legend di atas */}
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 12 }} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="55%"
                    outerRadius="80%"
                    paddingAngle={0}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>
        </Box>

        {/* Sumber data */}
        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic', fontSize: '0.65rem' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

PiePerkembanganDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
