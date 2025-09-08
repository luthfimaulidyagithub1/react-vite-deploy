// PieRutaBudidayaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PieRutaBudidayaCard({ isLoading, data, tahun, kecamatan }) {
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
    let filtered = data.filter(
      (item) =>
        String(item.tahun) === String(tahun) && String(item.kecamatan).toLowerCase().trim() === String(kecamatan).toLowerCase().trim()
    );

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // kelompokkan berdasarkan jenis budidaya
    const grouped = {};
    filtered.forEach((item) => {
      const key = item['jenis budidaya'] || 'Tidak Diketahui';
      const jumlah = toNumber(item['jumlah ruta']);
      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += jumlah;
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
    theme.palette.info.main
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
        {(percent * 100).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
          Distribusi Rumah Tangga Perikanan Budidaya menurut Subsektor di Kec. {kecamatan}, {tahun}
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
                    {chartData.map((entry, index) => {
                      const fill = colors[index % colors.length];
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `${value.toLocaleString('id-ID', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })} ruta`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textAlign: 'center'
                }}
              >
                Tidak terdapat ruta perikanan budidaya
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

PieRutaBudidayaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
