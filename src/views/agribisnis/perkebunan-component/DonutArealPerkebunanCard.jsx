// DonutArealPerkebunanCard.jsx
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

export default function DonutArealPerkebunanCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [sumber, setSumber] = useState('');
  const [totalPanen, setTotalPanen] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      setTotalPanen(0);
      return;
    }

    // filter kategori Luas Areal + tahun + kecamatan
    let filtered = data.filter(
      (item) =>
        String(item.kategori).toLowerCase().trim() === 'luas areal (ha)' &&
        String(item.tahun) === String(tahun) &&
        (kecamatan === 'Semua' || String(item.kecamatan).trim() === String(kecamatan).trim())
    );

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const total = filtered.reduce((sum, item) => sum + toNumber(item['nilai']), 0);

    // kelompokkan berdasarkan jenis tanaman
    let grouped = {};
    filtered.forEach((item) => {
      const tanaman = item['jenis tanaman'] || 'Tidak diketahui';
      const jumlah = toNumber(item['nilai']);
      if (!grouped[tanaman]) grouped[tanaman] = 0;
      grouped[tanaman] += jumlah;
    });

    // urutkan & ambil 8 terbesar
    let sorted = Object.entries(grouped)
      .map(([name, jumlah]) => ({ name, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    let top8 = sorted.slice(0, 8);
    let lainnya = sorted.slice(8);

    if (lainnya.length > 0) {
      const sumLainnya = lainnya.reduce((sum, item) => sum + item.jumlah, 0);
      top8.push({ name: 'Lainnya', jumlah: sumLainnya });
    }

    const result = top8.map((item) => ({
      name: item.name,
      jumlah: item.jumlah,
      value: (item.jumlah / total) * 100 || 0
    }));

    setChartData(result);
    setTotalPanen(total);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun, kecamatan]);

  // custom legend
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
              {entry.jumlah.toLocaleString('id-ID')} Ha ({entry.value.toFixed(2)}%)
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
          Distribusi Luas Areal (Ha) Perkebunan di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart + legend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Box sx={{ width: '100%', height: 250, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.length > 0 ? chartData : [{ name: 'Kosong', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="70%"
                  paddingAngle={0}
                  dataKey="value"
                  label={chartData.length > 0 ? ({ percent }) => `${(percent * 100).toFixed(1)}%` : () => ''}
                >
                  {(chartData.length > 0 ? chartData : [{ name: 'Kosong', value: 1 }]).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        chartData.length > 0 ? COLORS[index % COLORS.length] : '#e0e0e0' // warna abu2 kalau kosong
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name, props) => {
                    if (!props?.payload || !props.payload.jumlah) return ['0 Ha', name];
                    const jumlah = props.payload.jumlah;
                    return [`${jumlah.toLocaleString('id-ID')} Ha (${value.toFixed(2)}%)`, props.payload.name];
                  }}
                  contentStyle={{ fontSize: '0.75rem' }}
                  labelStyle={{ fontSize: '0.7rem' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Overlay tulisan kalau total nol */}
            {(!chartData.length || totalPanen === 0) && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  textAlign: 'center',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 500
                }}
              >
                Luas Areal Perkebunan = 0
              </Typography>
            )}
          </Box>

          {/* Legend */}
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

DonutArealPerkebunanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
