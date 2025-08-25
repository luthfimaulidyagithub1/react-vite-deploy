// src/ui-component/cards/statistik/PendudukMiskinLineCard.jsx
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

export default function PendudukMiskinLineCard({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const mapped = data.map((item) => {
      const keys = Object.keys(item || {});
      const jmlKey = keys.find((k) => normalize(k).includes('pendudukmiskin'));
      const persenKey = keys.find((k) => normalize(k).includes('persentase'));
      return {
        tahun: item?.tahun || '',
        jumlah: jmlKey ? parseFloat(item[jmlKey]) : null,
        persentase: persenKey ? parseFloat(item[persenKey]) : null,
        sumber: item?.sumber || null
      };
    });

    setChartData(mapped);
    if (mapped.length > 0) setSumber(mapped[0]?.sumber || null);
  }, [data]);

  // formatter angka
  const formatNumber = (num) =>
    num != null
      ? num.toLocaleString('id-ID', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      : '-';

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
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
                color: theme.palette.text.primary
              }}
            >
              Jumlah & Persentase Penduduk Miskin per Tahun
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ right: 10, left: 10 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} orientation="left" />
                  <YAxis yAxisId="right" tick={{ fontSize: 12 }} orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'jumlah')
                        return [
                          `${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ribu jiwa`,
                          'Penduduk Miskin'
                        ];
                      if (name === 'persentase')
                        return [`${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, 'Persentase'];
                      return value;
                    }}
                  />

                  {/* Line jumlah penduduk miskin */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="jumlah"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                    name="jumlah"
                  />

                  {/* Line persentase penduduk miskin */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="persentase"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={false}
                    name="persentase"
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

PendudukMiskinLineCard.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
