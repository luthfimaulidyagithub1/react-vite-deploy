// src/ui-component/cards/statistik/LineChartCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

// fungsi normalisasi key object (biar gampang dicari)
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

export default function LineChartCard({ data = [], tahun, indikator = '' }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0 || !indikator) return;

    // filter tahun
    const filtered = data.filter((item) => String(item?.tahun) === String(tahun));
    if (filtered.length === 0) return;

    // tentukan base field sesuai indikator
    let fieldBase = '';
    const indikatorLower = indikator.toLowerCase();
    if (indikatorLower.includes('suhu')) fieldBase = 'suhu';
    else if (indikatorLower.includes('kelembaban')) fieldBase = 'kelembaban';
    else if (indikatorLower.includes('angin')) fieldBase = 'angin';
    else if (indikatorLower.includes('udara')) fieldBase = 'udara';

    // mapping data
    const mapped = filtered.map((item) => {
      const keys = Object.keys(item || {});
      const minKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('min'));
      const rataKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('rata'));
      const maxKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('max'));

      return {
        bulan: item?.bulan || '',
        min: minKey ? parseFloat(item[minKey]) : null,
        rata: rataKey ? parseFloat(item[rataKey]) : null,
        max: maxKey ? parseFloat(item[maxKey]) : null
      };
    });

    setChartData(mapped);
    setSumber(filtered[0]?.sumber || null);
  }, [data, tahun, indikator]);

  return (
    <MainCard>
      {/* Judul Chart */}
      <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'left', fontWeight: 600, color: theme.palette.text.primary }}>
        {indikator} per Bulan di Stasiun Umbu Mehang Kunda, {tahun}
      </Typography>

      {/* Chart */}
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ right: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="bulan" tick={{ fontSize: 12 }} interval={0} angle={-40} textAnchor="end" height={60} />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']} // otomatis tapi ada ruang
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        p: 1
                      }}
                    >
                      {/* Judul tooltip */}
                      <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.primary' }}>
                        {indikator} Bulan {label}
                      </Typography>

                      {/* Data tiap line */}
                      {payload.map((p, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontWeight: 500,
                            color: p.color // sesuai warna line
                          }}
                        >
                          {p.name}: {p.value != null ? p.value.toFixed(1) : '-'}
                        </Typography>
                      ))}
                    </Box>
                  );
                }
                return null;
              }}
            />

            <Legend verticalAlign="top" align="left" wrapperStyle={{ fontSize: '12px', paddingBottom: 20 }} />
            {/* Urutan line: Minimum → Rata-rata → Maksimum */}
            <Line
              type="monotone"
              dataKey="min"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Minimum"
            />
            <Line
              type="monotone"
              dataKey="rata"
              stroke={theme.palette.success.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Rata-rata"
              label={{
                position: 'top',
                fontSize: 10,
                fill: theme.palette.success.main,
                formatter: (value) => (value != null ? value.toFixed(1) : '')
              }}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke={theme.palette.error.main}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Maksimum"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* sumber */}
      {sumber && (
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            display: 'block',
            textAlign: 'left',
            fontStyle: 'italic',
            color: 'text.secondary'
          }}
        >
          Sumber: {sumber}
        </Typography>
      )}
    </MainCard>
  );
}

LineChartCard.propTypes = {
  data: PropTypes.array,
  tahun: PropTypes.string,
  indikator: PropTypes.string
};
