// StackedPDRBCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Tooltip as MuiTooltip } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function StackedPDRBCard({ isLoading, data }) {
  const [chartData, setChartData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({}); // mapping kategori -> lapangan usaha
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setKategoriList([]);
      setKategoriMap({});
      setSumber('');
      return;
    }

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // ambil list kategori dan mapping ke lapangan usaha
    const kategoriSet = new Set();
    const map = {};
    data.forEach((item) => {
      if (item.kategori && item['lapangan usaha']) {
        const kat = String(item.kategori).trim();
        const lap = String(item['lapangan usaha']).trim();
        kategoriSet.add(kat);
        map[kat] = lap;
      }
    });
    const kategoriArr = Array.from(kategoriSet);
    setKategoriList(kategoriArr);
    setKategoriMap(map);

    // group data per tahun
    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const kat = String(item.kategori).trim();
      const val = toNumber(item['PDRB ADHB (miliar rupiah)']);
      const distribusi = toNumber(item['distribusi PDRB ADHB']);

      if (!grouped[th]) {
        grouped[th] = { tahun: th };
        kategoriArr.forEach((k) => {
          grouped[th][k] = { value: 0, distribusi: 0 };
        });
      }
      grouped[th][kat].value += val;
      grouped[th][kat].distribusi = distribusi; // pakai distribusi terakhir atau rata-rata jika perlu
    });

    // ubah format untuk chart
    const result = Object.values(grouped).map((row) => {
      const newRow = { tahun: row.tahun };
      kategoriArr.forEach((k) => {
        newRow[k] = row[k].value;
        newRow[`${k}_distribusi`] = row[k].distribusi;
      });
      return newRow;
    });

    setChartData(result);

    if (data.length > 0 && data[0].sumber) {
      setSumber(data[0].sumber);
    }
  }, [data]);

  const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
    '#393b79',
    '#637939',
    '#8c6d31',
    '#843c39',
    '#7b4173',
    '#3182bd',
    '#f7b6d2'
  ];

  // Tooltip chart (hanya kategori + nilai + distribusi)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 8 }}>
          <strong>{label}</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {payload.map((entry, idx) => (
              <li key={idx} style={{ color: entry.color }}>
                {entry.name}: Rp {entry.value.toLocaleString('id-ID')} miliar ({entry.payload[`${entry.name}_distribusi`].toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Legend custom (gabungan kategori + lapangan usaha)
  const CustomLegend = ({ payload }) => {
    if (!payload) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 20 }}>
        {kategoriList.map((kat, idx) => {
          const color = colors[idx % colors.length];
          const lapangan = kategoriMap[kat] || kat;
          return (
            <MuiTooltip key={kat} title={lapangan} arrow placement="left">
              <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', cursor: 'pointer' }}>
                <div style={{ width: 14, height: 14, backgroundColor: color, marginRight: 6, borderRadius: 3 }} />
                <span style={{ fontSize: '0.8rem', color: '#444' }}>
                  {kat} ({lapangan})
                </span>
              </div>
            </MuiTooltip>
          );
        })}
      </div>
    );
  };

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', color: theme.palette.text.primary }}>
          PDRB Atas Dasar Harga Berlaku Menurut Lapangan Usaha di Kabupaten Sumba Barat
        </Typography>

        <Box sx={{ flex: 1, minHeight: 600 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="tahun" />
                <YAxis tickFormatter={(val) => `Rp${val.toLocaleString('id-ID')}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="middle" align="right" layout="vertical" content={<CustomLegend />} />
                {kategoriList.map((kat, idx) => (
                  <Area
                    key={kat}
                    type="basis"
                    dataKey={kat}
                    stackId="1"
                    stroke={colors[idx % colors.length]}
                    fill={colors[idx % colors.length]}
                    name={kat}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Belum ada data
            </Typography>
          )}
        </Box>

        {sumber && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left', fontStyle: 'italic' }}>
            Sumber: {sumber}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

StackedPDRBCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array
};
