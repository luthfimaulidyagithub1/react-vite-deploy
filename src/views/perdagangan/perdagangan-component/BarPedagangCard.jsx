// BarPedagangCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarPedagangCard({ isLoading, data, tahun }) {
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

    // filter berdasarkan tahun
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
      const besar = toNumber(item['pedagang besar']);
      const menengah = toNumber(item['pedagang menengah']);
      const kecil = toNumber(item['pedagang kecil']);
      return {
        kecamatan: item['kecamatan'],
        pedagangBesar: besar,
        pedagangMenengah: menengah,
        pedagangKecil: kecil,
        total: besar + menengah + kecil // total untuk label
      };
    });

    setChartData(result);

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
          Jumlah Pedagang menurut Jenis Pedagang per Kecamatan di Kabupaten Sumba Barat, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
              <XAxis
                type="number"
                allowDecimals={false}
                tickFormatter={(val) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(val)}
              />
              <YAxis type="category" dataKey="kecamatan" width={isSmall ? 80 : 120} tick={{ fontSize: 11 }} />

              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12, paddingBottom: 10 }} />

              <Bar dataKey="pedagangBesar" stackId="a" fill={theme.palette.primary.main} name="Pedagang Besar" />
              <Bar dataKey="pedagangMenengah" stackId="a" fill={theme.palette.success.main} name="Pedagang Menengah" />
              <Bar dataKey="pedagangKecil" stackId="a" fill={theme.palette.warning.dark} name="Pedagang Kecil">
                {/* label total di luar bar */}
                <LabelList
                  dataKey="total"
                  position="right"
                  formatter={(val) => (val > 0 ? val.toLocaleString('id-ID') : '')}
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

BarPedagangCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
