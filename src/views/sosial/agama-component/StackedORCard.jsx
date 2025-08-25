// StackedORCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedORCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun & kecamatan
    let filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && (!kecamatan || String(item.kecamatan).trim() === String(kecamatan).trim())
    );

    // group berdasarkan jenis OR
    const grouped = {};
    filtered.forEach((item) => {
      const jenisOR = String(item['jenis OR']).trim();
      if (!grouped[jenisOR]) {
        grouped[jenisOR] = {
          jenisOR,
          baik: 0,
          rusakSedang: 0,
          rusakParah: 0
        };
      }

      grouped[jenisOR].baik += parseInt(item['kondisi baik'] || 0, 10);
      grouped[jenisOR].rusakSedang += parseInt(item['kondisi rusak sedang'] || 0, 10);
      grouped[jenisOR].rusakParah += parseInt(item['kondisi rusak parah'] || 0, 10);
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
          Banyak Desa dengan Fasilitas Olahraga menurut Jenis & Kondisi di
          {kecamatan ? ` Kecamatan ${kecamatan}` : ''}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="jenisOR" interval={0} tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="baik" stackId="a" fill={theme.palette.success.main} name="Kondisi Baik" />
                <Bar dataKey="rusakSedang" stackId="a" fill={theme.palette.warning.main} name="Rusak Sedang" />
                <Bar dataKey="rusakParah" stackId="a" fill={theme.palette.error.main} name="Rusak Parah">
                  {/* Label total di atas stack */}
                  <LabelList
                    dataKey={(entry) => entry.baik + entry.rusakSedang + entry.rusakParah}
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

StackedORCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
