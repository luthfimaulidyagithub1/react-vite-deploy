// StackedPUKCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedPUKCard({ isLoading, data, tahun }) {
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

    // group berdasarkan pendidikan
    const grouped = {};
    filtered.forEach((item) => {
      const pendidikan = String(item.pendidikan).trim();
      if (!grouped[pendidikan]) {
        grouped[pendidikan] = { pendidikan, ak: 0, bukanAk: 0 };
      }

      // jumlahkan AK dan Bukan AK
      grouped[pendidikan].ak += parseInt(item['jumlah AK'] || 0, 10);
      grouped[pendidikan].bukanAk += parseInt(item['bukan AK'] || 0, 10);
    });

    setChartData(Object.values(grouped));

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

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
          Jumlah Penduduk Usia Kerja menurut Pendidikan, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="pendidikan" interval={0} tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="ak" stackId="a" fill={theme.palette.success.dark} name="Angkatan Kerja" />
                <Bar dataKey="bukanAk" stackId="a" fill={theme.palette.error.dark} name="Bukan Angkatan Kerja">
                  {/* Label total di atas stack */}
                  <LabelList
                    dataKey={(entry) => entry.ak + entry.bukanAk}
                    position="top"
                    formatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
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

StackedPUKCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
