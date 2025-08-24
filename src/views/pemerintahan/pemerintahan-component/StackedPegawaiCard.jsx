// StackedPegawaiCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedPegawaiCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan (kalau bukan "Semua")
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    // group berdasarkan pemda
    const grouped = {};
    filtered.forEach((item) => {
      const pemda = String(item.pemda).trim();
      if (!grouped[pemda]) {
        grouped[pemda] = { pemda, negeri: 0, honorer: 0 };
      }
      grouped[pemda].negeri += parseInt(item['pegawai negeri'] || 0, 10);
      grouped[pemda].honorer += parseInt(item['honorer'] || 0, 10);
    });

    setChartData(Object.values(grouped));

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

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
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Jumlah Pegawai Negeri dan Honorer menurut Pemda di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="pemda" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="negeri" stackId="a" fill={theme.palette.primary.main} name="Pegawai Negeri" />
                <Bar dataKey="honorer" stackId="a" fill={theme.palette.secondary.main} name="Pegawai Honorer">
                  {/* Label total di ujung bar */}
                  <LabelList
                    dataKey={(entry) => entry.negeri + entry.honorer}
                    position="right"
                    formatter={(val) => new Intl.NumberFormat().format(val)}
                    style={{ fontSize: 11, fontWeight: 600, fill: theme.palette.text.primary }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Belum ada data
            </Typography>
          )}
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

StackedPegawaiCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
