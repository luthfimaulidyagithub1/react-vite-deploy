// src/ui-component/cards/statistik/LajuPDRBPengeluaranLineChart.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Tooltip as MuiTooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LajuPDRBPengeluaranLineChart({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [selectedPengeluaran, setSelectedPengeluaran] = useState('ALL');
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // ambil daftar jenis pengeluaran unik
    const setPengeluaran = new Set();
    data.forEach((item) => {
      if (item?.['jenis pengeluaran']) setPengeluaran.add(item['jenis pengeluaran']);
    });
    const pengeluaranArr = Array.from(setPengeluaran);
    setPengeluaranList(pengeluaranArr);

    // mapping data berdasarkan tahun
    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const jenis = item['jenis pengeluaran'];
      const val = parseFloat(item['laju pertumbuhan PDRB ADHK']) || 0;

      if (!grouped[th]) grouped[th] = { tahun: th };
      grouped[th][jenis] = val;
    });

    setChartData(Object.values(grouped));

    if (data[0]?.sumber) setSumber(data[0].sumber);
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

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={300} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={250} />
          </>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600, color: theme.palette.text.primary }}>
              Laju Pertumbuhan PDRB ADHK Menurut Jenis Pengeluaran di Kabupaten Sumba Barat
            </Typography>

            {/* Dropdown filter */}
            <FormControl size="small" sx={{ minWidth: 250, mb: 3 }}>
              <InputLabel id="pengeluaran-select-label">Pilih Jenis Pengeluaran</InputLabel>
              <Select
                labelId="pengeluaran-select-label"
                value={selectedPengeluaran}
                label="Pilih Jenis Pengeluaran"
                onChange={(e) => setSelectedPengeluaran(e.target.value)}
              >
                <MenuItem value="ALL">Tampilkan Semua</MenuItem>
                {pengeluaranList.map((p, i) => (
                  <MenuItem key={i} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 50, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="tahun" />
                  <YAxis domain={['auto', 'auto']} tickFormatter={(val) => `${val.toFixed(2)}%`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Box sx={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', p: 1 }}>
                            <Typography variant="caption" fontWeight="bold">
                              Tahun {label}
                            </Typography>
                            {payload.map((p, idx) => (
                              <Typography key={idx} variant="caption" sx={{ display: 'block', color: p.color }}>
                                {p.name}: {p.value?.toFixed(2)}%
                              </Typography>
                            ))}
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{ paddingLeft: 20 }}
                    content={({ payload }) => (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {payload.map((entry, i) => (
                          <MuiTooltip key={i} title={entry.value} arrow placement="left">
                            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', cursor: 'pointer' }}>
                              <div style={{ width: 14, height: 14, backgroundColor: entry.color, marginRight: 6, borderRadius: 3 }} />
                              <span style={{ fontSize: '0.8rem', color: '#444' }}>{entry.value}</span>
                            </div>
                          </MuiTooltip>
                        ))}
                      </div>
                    )}
                  />
                  {(selectedPengeluaran === 'ALL' ? pengeluaranList : [selectedPengeluaran]).map((jenis, idx) => (
                    <Line
                      key={jenis}
                      type="monotone"
                      dataKey={jenis}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={jenis}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Sumber */}
            {sumber && (
              <Typography
                variant="caption"
                sx={{ mt: 2, display: 'block', textAlign: 'left', fontStyle: 'italic', color: 'text.secondary' }}
              >
                Sumber: {sumber}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

LajuPDRBPengeluaranLineChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
