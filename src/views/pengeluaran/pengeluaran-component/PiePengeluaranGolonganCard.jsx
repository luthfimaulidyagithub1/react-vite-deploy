import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Grid, Paper, useMediaQuery } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PiePengeluaranGolonganCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // deteksi mobile

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    if (filtered.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    const result = filtered.map((item) => ({
      name: item['golongan pengeluaran per orang sebulan (rupiah)'] || 'Tidak diketahui',
      value: Number(item['persentase penduduk']) || 0
    }));

    setChartData(result);

    if (filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  const colors = [
    '#00897B',
    '#D81B60',
    '#5D4037',
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.dark
  ];

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
        {(percent * 100).toFixed(2).replace('.', ',')}%
      </text>
    );
  };

  const isDataEmpty = !data || data.length === 0;
  const hasValue = chartData.some((d) => d.value > 0);

  // Interpretasi sederhana
  const interpretasi = hasValue
    ? (() => {
        const max = chartData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), chartData[0]);
        return (
          <span>
            Pada tahun <strong>{tahun}</strong>, sebagian besar penduduk Kabupaten Sumba Barat (
            <strong>{max.value.toFixed(2).replace('.', ',')}%</strong>) mengeluarkan <strong>{max.name}</strong> per orang setiap bulan.
          </span>
        );
      })()
    : 'Tidak ada data yang bisa diinterpretasikan.';

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.grey[200]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Persentase Penduduk menurut Golongan Pengeluaran Per Kapita (Per Orang) Sebulan (Rupiah) di Kabupaten Sumba Barat, {tahun}
        </Typography>

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {isDataEmpty || !hasValue ? (
            <Grid item xs={12}>
              <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Belum ada data
                </Typography>
              </Box>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={8}>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Legend
                        layout={isMobile ? 'horizontal' : 'vertical'}
                        align={isMobile ? 'center' : 'right'}
                        verticalAlign={isMobile ? 'bottom' : 'middle'}
                        wrapperStyle={{ fontSize: 12 }}
                      />
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
                      <Tooltip
                        formatter={(value, name, props) => [`${Number(value).toFixed(2).replace('.', ',')}%`, `${props.payload.name}`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    border: (theme) => `1px solid ${theme.palette.grey[600]}`,
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Interpretasi
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {interpretasi}
                  </Typography>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>

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

PiePengeluaranGolonganCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
