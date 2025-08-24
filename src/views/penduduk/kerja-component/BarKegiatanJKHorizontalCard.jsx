// BarKegiatanJKHorizontalCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarKegiatanJKHorizontalCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const result = filtered.map((item) => {
      const laki = toNumber(item['laki']);
      const perempuan = toNumber(item['perempuan']);
      return {
        name: item['status pekerjaan utama'],
        laki,
        perempuan
      };
    });

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Jumlah Penduduk menurut Status Pekerjaan Utama dan Jenis Kelamin, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 50, left: 20, bottom: 10 }}>
              {/* <CartesianGrid horizontal={false} strokeDasharray="3 3" /> */}
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={isSmall ? 90 : 120} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

              <Bar dataKey="laki" fill={theme.palette.primary.main} name="Laki-laki">
                <LabelList
                  dataKey="laki"
                  position="right"
                  formatter={(val) => val.toLocaleString('id-ID')}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fill: theme.palette.text.primary
                  }}
                />
              </Bar>
              <Bar dataKey="perempuan" fill={theme.palette.error.main} name="Perempuan">
                <LabelList
                  dataKey="perempuan"
                  position="right"
                  formatter={(val) => val.toLocaleString('id-ID')}
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

        {sumber && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
              textAlign: 'left',
              fontStyle: 'italic',
              fontSize: '0.65rem'
            }}
          >
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

BarKegiatanJKHorizontalCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
