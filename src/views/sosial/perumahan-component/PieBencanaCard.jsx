// PieBencanaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PieBencanaCard({ isLoading, data, tahun, kecamatan }) {
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

    const grouped = {
      'Gempa Bumi': 0,
      'Tanah Longsor': 0,
      Banjir: 0,
      Kekeringan: 0,
      'Angin Puyuh': 0
    };

    filtered.forEach((item) => {
      grouped['Gempa Bumi'] += toNumber(item['gempa bumi']);
      grouped['Tanah Longsor'] += toNumber(item['tanah longsor']);
      grouped['Banjir'] += toNumber(item['banjir']);
      grouped['Kekeringan'] += toNumber(item['kekeringan']);
      grouped['Angin Puyuh'] += toNumber(item['angin puyuh']);
    });

    const result = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key]
    }));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  // palet warna: primary, secondary, warning, error, success
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.success.main
  ];

  // label di luar pie, warna = warna slice
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index, value, percent }) => {
    if (value === 0) return null;

    const radius = outerRadius * 1.15; // sedikit keluar
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill={colors[index % colors.length]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 600 }}
      >
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
          Distribusi Kejadian Bencana Alam di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 300 }}>
            {chartData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 12 }} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('id-ID')} Kejadian`} />
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

PieBencanaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
