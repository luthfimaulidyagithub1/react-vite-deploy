// BarLuasHutanCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

export default function BarLuasHutanCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:600px)');

  const COLORS = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    '#8BC34A'
  ];

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter berdasarkan tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // akumulasi luas hutan per kawasan
    const luasByKawasan = {};
    filtered.forEach((item) => {
      const kawasan = item['nama kawasan hutan'] || 'Tidak diketahui';
      const val = toNumber(item['luas (ha)']);
      if (!luasByKawasan[kawasan]) luasByKawasan[kawasan] = 0;
      luasByKawasan[kawasan] += val;
    });

    const result = Object.keys(luasByKawasan).map((kawasan) => ({
      name: kawasan,
      jumlah: luasByKawasan[kawasan]
    }));

    // urutkan dari luas terbesar
    result.sort((a, b) => b.jumlah - a.jumlah);

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  const formatNumber = (val) => {
    return val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <Card sx={{ borderRadius: 2, height: '100%', border: (theme) => `2px solid ${theme.palette.grey[100]}` }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Luas Hutan per Kawasan ({tahun})
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 70, left: 10, bottom: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={formatNumber} />
              <YAxis dataKey="name" type="category" width={isSmall ? 100 : 120} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val) => `${formatNumber(val)} ha`} />

              <Bar dataKey="jumlah" name="Luas Hutan (ha)">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="jumlah"
                  position="right"
                  valueAccessor={(entry) => entry.value}
                  formatter={(val) => formatNumber(val)}
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    fill: theme.palette.text.primary
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Belum ada data
          </Typography>
        )}

        {sumber && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
              textAlign: 'left',
              fontStyle: 'italic'
            }}
          >
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

BarLuasHutanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
