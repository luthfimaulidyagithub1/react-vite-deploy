// PieJalanTerluasCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PieJalanTerluasCard({ isLoading, data, tahun, kecamatan }) {
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
    const filtered = data.filter((item) => String(item.tahun) === String(tahun) && (!kecamatan || item.kecamatan === kecamatan));

    // kelompokkan berdasarkan Jenis Permukaan Jalan Darat Terluas
    const grouped = {};
    filtered.forEach((item) => {
      const key = item['Jenis Permukaan Jalan Darat Terluas'] || 'Tidak Diketahui';
      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += 1; // hitung jumlah desa per jenis
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

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.grey[800]
  ];

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
          Distribusi Jumlah Desa/Kelurahan menurut Jenis Permukaan Jalan Darat Terluas
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
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => `${value.toLocaleString('id-ID')} desa`} />
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

PieJalanTerluasCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  kecamatan: PropTypes.string
};
