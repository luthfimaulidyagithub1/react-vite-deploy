// PieBAKCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
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

export default function PieBAKCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun & kategori Bukan Angkatan Kerja
    const filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && String(item.kategori).toLowerCase() === 'bukan angkatan kerja'
    );

    // helper parse number
    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // mapping kegiatan utama
    const result = filtered.map((item) => ({
      name: item['kegiatan utama'],
      value: toNumber(item['lk dan pr'])
    }));

    // urutkan sesuai urutan custom
    const order = ['Sekolah', 'Mengurus Rumah Tangga', 'Lainnya'];
    result.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  // warna khusus
  const colorMap = {
    Sekolah: theme.palette.orange.dark,
    'Mengurus Rumah Tangga': theme.palette.orange.main,
    Lainnya: theme.palette.orange.light
  };

  // custom label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    const kegiatan = chartData[index]?.name;
    const fillColor = getTextColor(colorMap[kegiatan] || theme.palette.primary.main);

    return (
      <text x={x} y={y} fill={fillColor} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
        {(percent * 100).toFixed(1)}% ({value.toLocaleString('id-ID')})
      </text>
    );
  };

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.orange.light}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Judul */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.orange.dark }}>
          Distribusi Penduduk Bukan Angkatan Kerja Menurut Kegiatan Utama, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 280 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                    {chartData.map((entry, index) => {
                      const fill = colorMap[entry.name] || theme.palette.primary.main;
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('id-ID')} Jiwa`} />
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
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              textAlign: 'left',
              fontStyle: 'italic',
              fontSize: '0.65rem'
            }}
          >
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

PieBAKCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
