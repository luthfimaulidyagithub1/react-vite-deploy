// DonutPendudukAgamaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const COLORS = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080'
];

export default function DonutPendudukAgamaCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [sumber, setSumber] = useState('');
  const [totalPenduduk, setTotalPenduduk] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      setTotalPenduduk(0);
      return;
    }

    // filter sesuai tahun & kecamatan
    let filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && String(item.kecamatan).trim() === String(kecamatan).trim()
    );

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const total = filtered.reduce((sum, item) => sum + toNumber(item['jumlah penduduk']), 0);

    const result = filtered.map((item) => {
      const jumlah = toNumber(item['jumlah penduduk']);
      return {
        name: item['agama'],
        jumlah,
        value: (jumlah / total) * 100 || 0
      };
    });

    setChartData(result);
    setTotalPenduduk(total);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun, kecamatan]);

  // custom legend (horizontal di bawah chart)
  const CustomLegend = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: 2
      }}
    >
      {chartData.map((entry, index) => (
        <Box
          key={`legend-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mr: 2,
            mb: 1,
            fontSize: '0.65rem',
            fontWeight: hoverIndex === index ? 'bold' : 'normal',
            color: hoverIndex === index ? COLORS[index % COLORS.length] : 'inherit'
          }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: COLORS[index % COLORS.length],
              borderRadius: '2px',
              mr: 1
            }}
          />
          {entry.name}
          {hoverIndex === index && (
            <Typography component="span" sx={{ ml: 1, fontSize: '0.65rem', color: 'text.secondary' }}>
              {entry.jumlah.toLocaleString('id-ID')} ({entry.value.toFixed(2)}%)
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.grey[100]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Judul */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
          Distribusi Penduduk Menurut Agama di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart + legend bawah */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Box sx={{ width: '100%', height: 250 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="70%"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      const jumlah = props.payload.jumlah;
                      return [`${jumlah.toLocaleString('id-ID')} (${value.toFixed(2)}%)`, props.payload.name];
                    }}
                    contentStyle={{ fontSize: '0.75rem' }}
                    labelStyle={{ fontSize: '0.7rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>

          {/* Legend custom di bawah */}
          {chartData.length > 0 && <CustomLegend />}
        </Box>

        {/* Sumber data */}
        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

DonutPendudukAgamaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
