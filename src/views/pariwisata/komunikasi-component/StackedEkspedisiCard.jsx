// StackedEkspedisiCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedEkspedisiCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun & kecamatan
    let filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && (!kecamatan || String(item.kecamatan).trim() === String(kecamatan).trim())
    );

    // group berdasarkan desa (deskel)
    const grouped = {};
    filtered.forEach((item) => {
      const desa = String(item.deskel).trim();

      if (!grouped[desa]) {
        grouped[desa] = {
          deskel: desa,
          kantorPos: 0,
          posKeliling: 0,
          jasaSwasta: 0
        };
      }

      // hanya hitung yang beroperasi
      if (String(item['kantor pos']).trim() === 'Beroperasi') grouped[desa].kantorPos += 1;
      if (String(item['pos keliling']).trim() === 'Beroperasi') grouped[desa].posKeliling += 1;
      if (String(item['jasa ekspedisi swasta']).trim() === 'Beroperasi') grouped[desa].jasaSwasta += 1;
    });

    setChartData(Object.values(grouped));

    // ambil sumber
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
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Judul */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
          Jumlah Jasa Ekspedisi yang Beroperasi di
          {kecamatan ? ` Kecamatan ${kecamatan}` : ''}, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="deskel" interval={0} tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={70} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                <Bar dataKey="kantorPos" stackId="a" fill={theme.palette.error.main} name="Kantor Pos" />
                <Bar dataKey="posKeliling" stackId="a" fill={theme.palette.warning.dark} name="Pos Keliling" />
                <Bar dataKey="jasaSwasta" stackId="a" fill={theme.palette.secondary.main} name="Jasa Ekspedisi Swasta">
                  {/* Label total di atas stack */}
                  <LabelList
                    dataKey={(entry) => entry.kantorPos + entry.posKeliling + entry.jasaSwasta}
                    position="top"
                    formatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
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

StackedEkspedisiCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
