// BarSaranaPerdaganganDesaCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarSaranaPerdaganganDesaCard({ isLoading, data, tahun, kecamatan }) {
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
      pertokoan: toNumber(item['kelompok pertokoan']),
      pasarPermanen: toNumber(item['pasar dengan bangunan permanen']),
      pasarSemi: toNumber(item['pasar dengan bangunan semi permanen']),
      pasarTanpa: toNumber(item['pasar tanpa bangunan']),
      minimarket: toNumber(item['mini market/swalayan/supermarket']),
      restoran: toNumber(item['restoran/rumah makan'])
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
          Jumlah Sarana Perdagangan di Desa/Kelurahan, Kec. {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 10 }}>
              {/* XAxis jadi kategori desa */}
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
              {/* YAxis jadi angka */}
              <YAxis allowDecimals={false} tickFormatter={(val) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(val)} />

              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

              <Bar dataKey="pertokoan" stackId="a" fill={theme.palette.primary.main} name="Kelompok Pertokoan">
                <LabelList
                  dataKey="pertokoan"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="pasarPermanen" stackId="a" fill={theme.palette.success.main} name="Pasar Permanen">
                <LabelList
                  dataKey="pasarPermanen"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="pasarSemi" stackId="a" fill={theme.palette.warning.dark} name="Pasar Semi Permanen">
                <LabelList
                  dataKey="pasarSemi"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="pasarTanpa" stackId="a" fill={theme.palette.grey[800]} name="Pasar Tanpa Bangunan">
                <LabelList
                  dataKey="pasarTanpa"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="minimarket" stackId="a" fill={theme.palette.error.main} name="Minimarket/Swalayan/Supermarket">
                <LabelList
                  dataKey="minimarket"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
                  style={{ fontSize: 10, fill: '#fff' }}
                />
              </Bar>
              <Bar dataKey="restoran" stackId="a" fill={theme.palette.secondary.main} name="Restoran/Rumah Makan">
                <LabelList
                  dataKey="restoran"
                  position="insideTop"
                  formatter={(val) => (val > 0 ? val : '')}
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

BarSaranaPerdaganganDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
