// PiePedagangCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PiePedagangCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter berdasarkan tahun & kecamatan
    const filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && (!kecamatan || String(item.kecamatan).trim() === String(kecamatan).trim())
    );

    if (filtered.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // ambil nilai pedagang
    const totalBesar = filtered.reduce((acc, cur) => acc + (Number(cur['pedagang besar']) || 0), 0);
    const totalMenengah = filtered.reduce((acc, cur) => acc + (Number(cur['pedagang menengah']) || 0), 0);
    const totalKecil = filtered.reduce((acc, cur) => acc + (Number(cur['pedagang kecil']) || 0), 0);

    const result = [
      { name: 'Pedagang Besar', value: totalBesar },
      { name: 'Pedagang Menengah', value: totalMenengah },
      { name: 'Pedagang Kecil', value: totalKecil }
    ];

    setChartData(result);

    if (filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  const colors = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.dark];

  // Label persentase
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, value }) => {
    if (value === 0) return null;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const fillColor = colors[index % colors.length];

    return (
      <text
        x={x}
        y={y}
        fill={fillColor}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 600 }}
      >
        {(percent * 100).toFixed(1)}%
      </text>
    );
  };

  const isDataEmpty = !data || data.length === 0;
  const hasValue = chartData.some((d) => d.value > 0);

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
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Distribusi Pedagang menurut Jenis Pedagang
          {kecamatan ? ` di Kec. ${kecamatan}` : ''}, {tahun}
        </Typography>

        {/* Chart / Pesan */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 280 }}>
            {isDataEmpty ? (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            ) : hasValue ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 12 }} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    paddingAngle={0}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => `${value.toLocaleString('id-ID')} pedagang`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Semua nilai = 0
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

PiePedagangCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  kecamatan: PropTypes.string
};
