// src/ui-component/cards/statistik/HariHujanLineCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// fungsi normalisasi key biar gampang cari field
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

export default function HariHujanLineCard({ data = [], tahun, isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // filter berdasarkan tahun
    const filtered = data.filter((item) => String(item?.tahun) === String(tahun));
    if (filtered.length === 0) return;

    // cari key hari hujan
    const mapped = filtered.map((item) => {
      const keys = Object.keys(item || {});
      const hariKey = keys.find((k) => normalize(k).includes('harihujan'));
      return {
        bulan: item?.bulan || '',
        hari: hariKey ? parseFloat(item[hariKey]) : null
      };
    });

    setChartData(mapped);
    setSumber(filtered[0]?.sumber || null);
  }, [data, tahun]);

  return (
    <Card
      sx={{
        // border: (theme) => `2px solid ${theme.palette.grey[200]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={300} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={170} />
          </>
        ) : (
          <>
            {/* Judul Chart */}
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                textAlign: 'left',
                fontWeight: 600,
                color: theme.palette.primary.dark
              }}
            >
              Hari Hujan (hari) per Bulan di Stasiun Umbu Mehang Kunda, {tahun}
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 170 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ right: 10, left: 10 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} interval={0} angle={-40} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
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
                            <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.primary' }}>
                              Bulan {label}
                            </Typography>
                            {payload.map((p, idx) => (
                              <Typography
                                key={idx}
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  fontWeight: 500,
                                  color: theme.palette.primary.dark
                                }}
                              >
                                hari hujan: {p.value != null ? p.value.toFixed(0) : '-'} hari
                              </Typography>
                            ))}
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="hari"
                    stroke={theme.palette.primary[200]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="hari hujan"
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
          </>
        )}
      </CardContent>
    </Card>
  );
}

HariHujanLineCard.propTypes = {
  data: PropTypes.array,
  tahun: PropTypes.string,
  isLoading: PropTypes.bool
};
