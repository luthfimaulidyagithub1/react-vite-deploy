// BarStrukturDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarStrukturDesaCard({ isLoading, data, tahun, kecamatan }) {
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

    // filter kecamatan
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    // siapkan data chart
    const result = filtered.map((item) => {
      const dusun = parseInt(item['dusun'] ?? 0, 10) || 0;
      const rw = parseInt(item['rw'] ?? 0, 10) || 0;
      const rt = parseInt(item['rt'] ?? 0, 10) || 0;

      return {
        name: item.deskel,
        dusun,
        rw,
        rt
      };
    });

    setChartData(result);

    // ambil sumber (anggap sama untuk semua baris)
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Jumlah Dusun, RW, dan RT per Desa di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

              <Bar dataKey="dusun" fill={theme.palette.primary.main} name="Dusun">
                <LabelList dataKey="dusun" position="top" fontSize={10} />
              </Bar>
              <Bar dataKey="rw" fill={theme.palette.secondary.main} name="RW">
                <LabelList dataKey="rw" position="top" fontSize={10} />
              </Bar>
              <Bar dataKey="rt" fill={theme.palette.success.main} name="RT">
                <LabelList dataKey="rt" position="top" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Belum ada data
          </Typography>
        )}

        {/* Sumber */}
        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'left', fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

BarStrukturDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
