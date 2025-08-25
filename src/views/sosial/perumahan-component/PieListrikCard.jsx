// PieListrikCard.jsx
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

export default function PieListrikCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun & kecamatan
    const filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && String(item.kecamatan).toLowerCase() === String(kecamatan).toLowerCase()
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

    // jumlahkan per kategori
    const penggunaTotal = filtered
      .filter((item) => String(item.kategori).toLowerCase() === 'pengguna listrik')
      .reduce((sum, item) => sum + toNumber(item['jumlah keluarga']), 0);

    const bukanPenggunaTotal = filtered
      .filter((item) => String(item.kategori).toLowerCase() === 'bukan pengguna listrik')
      .reduce((sum, item) => sum + toNumber(item['jumlah keluarga']), 0);

    const result = [
      { name: 'Pengguna Listrik', value: penggunaTotal },
      { name: 'Bukan Pengguna Listrik', value: bukanPenggunaTotal }
    ];

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  // warna khusus
  const colorMap = {
    'Pengguna Listrik': theme.palette.secondary.dark,
    'Bukan Pengguna Listrik': theme.palette.warning.dark
  };

  // custom label (tetap di dalam)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
    if (value === 0) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    const kategori = chartData[index]?.name;
    const fillColor = getTextColor(colorMap[kategori] || theme.palette.primary.dark);

    return (
      <text x={x} y={y} fill={fillColor} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
        {(percent * 100).toFixed(1)}% ({value.toLocaleString('id-ID')})
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
          Distribusi Jumlah Keluarga menurut Penggunaan Listrik di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 280 }}>
            {chartData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 12 }} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => {
                      const fill = colorMap[entry.name] || theme.palette.primary.dark;
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('id-ID')} KK`} />
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

PieListrikCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
