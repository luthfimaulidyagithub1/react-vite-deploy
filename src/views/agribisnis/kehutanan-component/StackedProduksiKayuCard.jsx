// StackedProduksiKayuCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedProduksiKayuCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter per tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // ubah ke format recharts
    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const mapped = filtered.map((item, idx) => ({
      kategori: item['bulan'] || `Data ${idx + 1}`,
      rimbaCampuran: toNumber(item['Rimba Campuran (m3)']),
      rimbaIstimewa: toNumber(item['Rimba Istimewa (m3)']),
      rimbaIndah: toNumber(item['Rimba Indah (m3)']),
      mpts: toNumber(item['MPTS (m3)'])
    }));

    setChartData(mapped);

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
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Judul */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Produksi Kayu Hutan (m³) menurut Jenis Produksi, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="kategori" interval={0} tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('id-ID', {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4
                    }).format(value)
                  }
                />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="rimbaCampuran" stackId="a" fill={theme.palette.primary.dark} name="Rimba Campuran (m³)" />
                <Bar dataKey="rimbaIstimewa" stackId="a" fill={theme.palette.secondary.main} name="Rimba Istimewa (m³)" />
                <Bar dataKey="rimbaIndah" stackId="a" fill={theme.palette.success.main} name="Rimba Indah (m³)" />
                <Bar dataKey="mpts" stackId="a" fill={theme.palette.error.main} name="MPTS (m³)">
                  {/* Label total di atas stack */}
                  <LabelList
                    dataKey={(entry) => entry.rimbaCampuran + entry.rimbaIstimewa + entry.rimbaIndah + entry.mpts}
                    position="top"
                    formatter={(val) =>
                      new Intl.NumberFormat('id-ID', {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4
                      }).format(val)
                    }
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
        </Box>

        {/* Sumber data */}
        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

StackedProduksiKayuCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
