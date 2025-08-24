// BarJarakDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarJarakDesaCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');

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
    const result = filtered.map((item) => ({
      name: item.deskel,
      kecamatan: parseFloat(item['jarak ke ibukota kecamatan (km)']) || 0,
      kabupaten: parseFloat(item['jarak ke ibukota kabkot (km)']) || 0
    }));

    setChartData(result);

    // ambil sumber (anggap sama untuk semua baris)
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  return (
    <Card
      sx={{
        // border: (theme) => `2px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Jarak Desa ke Ibukota Kecamatan & Kabupaten di {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={90} interval={0} tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} km`} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem' }} />
              <Bar dataKey="kabupaten" fill="#9c27b0" name="Jarak ke Ibukota Kab. (km)">
                <LabelList dataKey="kabupaten" position="top" formatter={(val) => `${val}`} fontSize={10} />
              </Bar>

              <Bar dataKey="kecamatan" fill="#1976d2" name="Jarak ke Ibukota Kec. (km)">
                <LabelList dataKey="kecamatan" position="top" formatter={(val) => `${val}`} fontSize={10} />
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

BarJarakDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
