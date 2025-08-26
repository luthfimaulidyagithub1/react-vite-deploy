// BarJumlahKapalCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';

export default function BarJumlahKapalCard({ isLoading, data, tahun }) {
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
    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // kumpulkan jenis kapal unik
    const jenisList = [...new Set(filtered.map((item) => item['jenis kapal']))];

    // kelompokkan berdasarkan kecamatan
    const kecamatanMap = {};
    filtered.forEach((item) => {
      const kec = String(item.kecamatan).trim();
      if (!kecamatanMap[kec]) {
        kecamatanMap[kec] = { name: kec };
      }
      const jenis = item['jenis kapal'];
      kecamatanMap[kec][jenis] = toNumber(item['jumlah']);
    });

    const result = Object.values(kecamatanMap);
    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

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
          Jumlah Perahu/Kapal Menurut Kecamatan, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: isSmall ? 80 : 40 // lebih lega kalau layar kecil
              }}
            >
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 11
                }}
                angle={isSmall ? -45 : 0}
                textAnchor={isSmall ? 'end' : 'middle'}
                height={isSmall ? 95 : 30}
                dy={isSmall ? 10 : 0}
              />

              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => val.toLocaleString('id-ID')} />
              <Legend
                wrapperStyle={{
                  fontSize: '12px',
                  marginTop: isSmall ? 30 : 0 // kasih jarak dengan XAxis
                }}
              />

              {/* Render Bar untuk tiap jenis kapal */}
              {Object.keys(chartData[0])
                .filter((k) => k !== 'name')
                .map((jenis, i) => {
                  const colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main];
                  return (
                    <Bar key={jenis} dataKey={jenis} name={jenis} fill={colors[i % colors.length]}>
                      <LabelList
                        dataKey={jenis}
                        position="top"
                        formatter={(val) => val.toLocaleString('id-ID')}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: theme.palette.text.primary
                        }}
                      />
                    </Bar>
                  );
                })}
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

BarJumlahKapalCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
