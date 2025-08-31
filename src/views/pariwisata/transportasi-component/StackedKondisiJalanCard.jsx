// StackedKondisiJalanCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedKondisiJalanCard({ isLoading, data, tahun }) {
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

    // kumpulkan semua kondisi jalan
    const jenisSet = new Set();
    filtered.forEach((item) => {
      if (item['kondisi jalan']) {
        jenisSet.add(String(item['kondisi jalan']).trim());
      }
    });
    const jenisArr = Array.from(jenisSet);
    setJenisList(jenisArr);

    // group berdasarkan kecamatan + simpan persen & asli
    const grouped = {};
    filtered.forEach((item) => {
      const kec = item.kecamatan || 'Tidak Diketahui';
      const jenis = String(item['kondisi jalan']).trim();
      const panjang = toNumber(item['panjang (km)']);

      if (!grouped[kec]) {
        grouped[kec] = { kecamatan: kec, total: 0 };
        jenisArr.forEach((j) => {
          grouped[kec][j] = { persen: 0, asli: 0 };
        });
      }
      grouped[kec][jenis].asli += panjang;
      grouped[kec].total += panjang;
    });

    // ubah ke persen
    const result = Object.values(grouped).map((row) => {
      const total = row.total || 1;
      const newRow = { kecamatan: row.kecamatan };
      jenisArr.forEach((j) => {
        const asli = row[j].asli;
        const persen = (asli / total) * 100;
        newRow[j] = persen;
        newRow[`${j}_asli`] = asli;
      });
      return newRow;
    });

    setChartData(result);

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun]);

  const colors = [theme.palette.success.main, theme.palette.grey[800], theme.palette.warning.dark, theme.palette.error.main];

  // custom tooltip biar muncul persen + km
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => {
              const asli = entry.payload[`${entry.name}_asli`] || 0;
              return (
                <li key={idx} style={{ color: entry.color }}>
                  {entry.name}: {entry.value.toFixed(2).replace('.', ',')} % (
                  {asli.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km)
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

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
          Persentase Panjang Jalan menurut Kondisi Jalan dan Kecamatan, {tahun}
        </Typography>

        {/* Chart */}
        <Box sx={{ flex: 1, minHeight: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 50, left: 0, bottom: 20 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val.toFixed(0)}%`} />
                <YAxis type="category" dataKey="kecamatan" width={120} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '0.8rem', paddingBottom: 20 }} />

                {jenisList.map((jenis, idx) => (
                  <Bar key={jenis} dataKey={jenis} stackId="a" fill={colors[idx % colors.length]} name={jenis}>
                    {idx === jenisList.length - 1 && (
                      <LabelList
                        dataKey={(entry) => jenisList.reduce((sum, j) => sum + (entry[j] || 0), 0)}
                        position="right"
                        formatter={(val) => `${val.toFixed(2).replace('.', ',')}%`}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          fill: theme.palette.text.primary
                        }}
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

StackedKondisiJalanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
