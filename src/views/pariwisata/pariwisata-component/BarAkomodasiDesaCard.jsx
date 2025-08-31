// BarAkomodasiDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarAkomodasiDesaCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:600px)'); // deteksi layar kecil

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan (jika bukan "Semua")
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const result = filtered.map((item) => ({
      name: item['deskel'],
      hotel: toNumber(item['hotel']),
      penginapan: toNumber(item['penginapan'])
    }));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

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
          Jumlah Sarana Akomodasi di Desa/Kelurahan, Kecamatan {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                tick={{
                  angle: -30, // miring -30 derajat
                  textAnchor: 'end', // biar rapi posisi
                  fontSize: 10 // opsional biar muat
                }}
                height={isSmall ? 90 : 70}
                angle={isSmall ? -30 : 0}
                textAnchor={isSmall ? 'end' : 'middle'}
              />
              <YAxis />
              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

              <Bar dataKey="hotel" fill={theme.palette.primary.main} name="Hotel">
                <LabelList
                  dataKey="hotel"
                  position="top"
                  formatter={(val) => val.toLocaleString('id-ID')}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fill: theme.palette.text.primary
                  }}
                />
              </Bar>
              <Bar dataKey="penginapan" fill={theme.palette.secondary.main} name="Penginapan">
                <LabelList
                  dataKey="penginapan"
                  position="top"
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

BarAkomodasiDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
