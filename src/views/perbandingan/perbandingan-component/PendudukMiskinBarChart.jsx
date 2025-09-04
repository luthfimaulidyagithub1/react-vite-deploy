// src/ui-component/cards/statistik/PendudukMiskinBarChart.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function PendudukMiskinBarChart({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [sumber, setSumber] = useState('');

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      setChartData([]);
      setTahunList([]);
      setSumber('');
      return;
    }

    const tahunSet = new Set();
    const grouped = {};

    data.forEach((item) => {
      const kabkot = item.kabkot;
      if (kabkot === 'Nusa Tenggara Timur') return; // skip NTT

      const th = item.tahun;
      const val = parseFloat(item['penduduk miskin']) || 0;

      tahunSet.add(th);

      if (!grouped[kabkot]) grouped[kabkot] = { kabkot };
      grouped[kabkot][th] = val;
    });

    setTahunList(Array.from(tahunSet).sort());
    setChartData(Object.values(grouped));

    if (data[0]?.sumber) setSumber(data[0].sumber);
  }, [data]);

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600, color: theme.palette.text.primary }}>
              Jumlah Penduduk Miskin Menurut Kabupaten/Kota
            </Typography>

            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                  <XAxis
                    dataKey="kabkot"
                    angle={-45} // label miring
                    textAnchor="end" // anchor agar miring tetap terlihat
                    interval={0} // tampil semua label
                  />
                  <YAxis tickFormatter={(val) => val.toLocaleString('id-ID')} />
                  <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
                  <Legend />
                  {tahunList.map((th, idx) => (
                    <Bar key={th} dataKey={th} fill={colors[idx % colors.length]} name={th} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {sumber && (
              <Typography
                variant="caption"
                sx={{ mt: 2, display: 'block', textAlign: 'left', fontStyle: 'italic', color: 'text.secondary' }}
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

PendudukMiskinBarChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
