// StackedMuridCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Padding } from 'maplibre-gl';

export default function StackedMuridCard({ isLoading, data, tahun, kecamatan }) {
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

    // group berdasarkan pendidikan
    const grouped = {};
    filtered.forEach((item) => {
      const pendidikan = String(item.pendidikan).trim();
      if (!grouped[pendidikan]) {
        grouped[pendidikan] = { pendidikan, negeri: 0, swasta: 0 };
      }
      grouped[pendidikan].negeri += parseInt(item['murid negeri'] || 0, 10);
      grouped[pendidikan].swasta += parseInt(item['murid swasta'] || 0, 10);
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
          Jumlah Murid Negeri dan Swasta menurut Tingkat Pendidikan di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis type="number" />
                <YAxis type="category" dataKey="pendidikan" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="negeri" stackId="a" fill={theme.palette.success.main} name="Murid Negeri" />
                <Bar dataKey="swasta" stackId="a" fill={theme.palette.secondary.main} name="Murid Swasta">
                  {/* Label total di ujung bar */}
                  <LabelList
                    dataKey={(entry) => entry.negeri + entry.swasta}
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

StackedMuridCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
