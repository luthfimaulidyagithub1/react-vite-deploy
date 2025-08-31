// LineJumlahPelangganListrikCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';

export default function LineJumlahPelangganListrikCard({ isLoading, data, kecamatan }) {
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

    // normalisasi angka
    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // kelompokkan berdasarkan tahun
    const tahunMap = {};
    data.forEach((item) => {
      const th = String(item.tahun).trim();
      const kec = String(item.kecamatan).trim();
      if (!tahunMap[th]) {
        tahunMap[th] = { tahun: th };
      }
      tahunMap[th][kec] = (tahunMap[th][kec] || 0) + toNumber(item['jumlah pelanggan listrik']);
    });

    let result = Object.values(tahunMap).sort((a, b) => a.tahun.localeCompare(b.tahun));

    // filter kecamatan kalau bukan "Semua"
    if (kecamatan && kecamatan !== 'Semua') {
      result = result.map((row) => ({
        tahun: row.tahun,
        [kecamatan]: row[kecamatan] || 0
      }));
    }

    setChartData(result);

    if (data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data, kecamatan]);

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.grey[800]
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        height: '100%',
        border: (theme) => `2px solid ${theme.palette.grey[100]}`
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
          Jumlah Pelanggan Listrik {kecamatan === 'Semua' ? 'menurut Kecamatan' : `${kecamatan}`} Setiap Tahun
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: isSmall ? 80 : 40
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="tahun"
                tick={{ fontSize: 11 }}
                angle={isSmall ? -45 : 0}
                textAnchor={isSmall ? 'end' : 'middle'}
                height={isSmall ? 95 : 30}
                dy={isSmall ? 10 : 0}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => val.toLocaleString('id-ID')} />
              <Tooltip formatter={(val) => `${val.toLocaleString('id-ID')} pelanggan`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />

              {/* render line untuk setiap kecamatan */}
              {Object.keys(chartData[0])
                .filter((k) => k !== 'tahun')
                .map((kec, i) => (
                  <Line key={kec} type="monotone" dataKey={kec} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 2 }}>
                    {kecamatan !== 'Semua' && (
                      <LabelList
                        dataKey={kec}
                        position="top"
                        formatter={(val) => val.toLocaleString('id-ID')}
                        style={{ fontSize: '10px', fontWeight: 600 }}
                      />
                    )}
                  </Line>
                ))}
            </LineChart>
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
              fontStyle: 'italic'
            }}
          >
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

LineJumlahPelangganListrikCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  kecamatan: PropTypes.string // bisa "Semua" atau nama kecamatan
};
