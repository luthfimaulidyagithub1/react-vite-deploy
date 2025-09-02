// BarLembagaKoperasiDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarLembagaKoperasiDesaCard({ isLoading, data, tahun, kecamatan }) {
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
      kud: toNumber(item['KUD']),
      ksp: toNumber(item['KSP']),
      kopinkra: toNumber(item['Kopinkra']),
      koperasiLainnya: toNumber(item['Koperasi Lainnya'])
    }));

    setChartData(result);

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
          Jumlah Lembaga Koperasi di Desa/Kelurahan, Kec. {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis
                type="number"
                allowDecimals={false}
                tickFormatter={(val) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(val)}
              />
              <YAxis type="category" dataKey="name" width={isSmall ? 80 : 100} tick={{ fontSize: 11 }} />

              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

              <Bar dataKey="kud" stackId="a" fill={theme.palette.primary.main} name="KUD">
                <LabelList
                  dataKey="kud"
                  position="insideRight"
                  formatter={(val) => (val > 0 ? val.toLocaleString('id-ID') : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="ksp" stackId="a" fill={theme.palette.secondary.main} name="KSP">
                <LabelList
                  dataKey="ksp"
                  position="insideRight"
                  formatter={(val) => (val > 0 ? val.toLocaleString('id-ID') : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="kopinkra" stackId="a" fill={theme.palette.success.main} name="Kopinkra">
                <LabelList
                  dataKey="kopinkra"
                  position="insideRight"
                  formatter={(val) => (val > 0 ? val.toLocaleString('id-ID') : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="koperasiLainnya" stackId="a" fill={theme.palette.warning.dark} name="Koperasi Lainnya">
                <LabelList
                  dataKey="koperasiLainnya"
                  position="insideRight"
                  formatter={(val) => (val > 0 ? val.toLocaleString('id-ID') : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
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

BarLembagaKoperasiDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
