// BarRestoranKecamatanCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';

export default function BarRestoranKecamatanCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:600px)');

  // array warna pakai palette berry vite react
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.dark,
    theme.palette.error.main,
    theme.palette.grey[800]
  ];

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const result = filtered.map((item) => ({
      name: item['kecamatan'],
      restoran: toNumber(item['jumlah rumah makan/restoran'])
    }));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
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
          Jumlah Rumah Makan/Restoran menurut Kecamatan, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                tick={({ x, y, payload, index }) => {
                  const color = colors[index % colors.length];
                  return (
                    <text x={x} y={y + 10} textAnchor="end" transform={`rotate(-30, ${x}, ${y})`} fontSize={10} fill={color}>
                      {payload.value}
                    </text>
                  );
                }}
                height={isSmall ? 90 : 70}
              />
              <YAxis />
              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              {/* <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} /> */}

              <Bar dataKey="restoran" name="Restoran">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
                <LabelList
                  dataKey="restoran"
                  position="top"
                  formatter={(val) => val.toLocaleString('id-ID')}
                  style={{
                    fontSize: 11,
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

BarRestoranKecamatanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
