// StackedPanjangJalanCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedPanjangJalanCard({ isLoading, data, tahun }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [jenisList, setJenisList] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setJenisList([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // fungsi parse angka
    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // kumpulkan semua jenis permukaan jalan
    const jenisSet = new Set();
    filtered.forEach((item) => {
      if (item['jenis permukaan jalan']) {
        jenisSet.add(String(item['jenis permukaan jalan']).trim());
      }
    });
    const jenisArr = Array.from(jenisSet);
    setJenisList(jenisArr);

    // group berdasarkan kecamatan
    const grouped = {};
    filtered.forEach((item) => {
      const kec = item.kecamatan || 'Tidak Diketahui';
      const jenis = String(item['jenis permukaan jalan']).trim();
      const panjang = toNumber(item['panjang (km)']);

      if (!grouped[kec]) {
        grouped[kec] = { kecamatan: kec };
        jenisArr.forEach((j) => {
          grouped[kec][j] = 0;
        });
      }
      grouped[kec][jenis] += panjang;
    });

    setChartData(Object.values(grouped));

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  const colors = [theme.palette.grey[800], theme.palette.warning.dark, theme.palette.orange.dark];

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
          Panjang Jalan (km) menurut Jenis Permukaan dan Kecamatan, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="kecamatan" width={120} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`}
                />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                {jenisList.map((jenis, idx) => (
                  <Bar key={jenis} dataKey={jenis} stackId="a" fill={colors[idx % colors.length]} name={jenis}>
                    {idx === jenisList.length - 1 && (
                      <LabelList
                        dataKey={(entry) => jenisList.reduce((sum, j) => sum + (entry[j] || 0), 0)}
                        position="right"
                        formatter={(val) => `${val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        style={{ fontSize: 11, fontWeight: 600, fill: theme.palette.text.primary }}
                      />
                    )}
                  </Bar>
                ))}
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

StackedPanjangJalanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
