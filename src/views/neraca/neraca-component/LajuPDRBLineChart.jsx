// src/ui-component/cards/statistik/LajuPDRBLineChart.jsx
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

export default function LajuPDRBLineChart({ data = [], isLoading }) {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [usahaList, setUsahaList] = useState([]); // daftar lapangan usaha
  const [selectedUsaha, setSelectedUsaha] = useState('ALL'); // filter dropdown
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    // ambil daftar lapangan usaha unik
    const usahaSet = new Set();
    data.forEach((item) => {
      if (item?.['lapangan usaha']) usahaSet.add(item['lapangan usaha']);
    });
    const usahaArr = Array.from(usahaSet);
    setUsahaList(usahaArr);

    // mapping data berdasarkan tahun
    const grouped = {};
    data.forEach((item) => {
      const th = item.tahun || 'Tidak Diketahui';
      const usaha = item['lapangan usaha'];
      const val = parseFloat(item['laju pertumbuhan PDRB ADHK']) || 0;

      if (!grouped[th]) grouped[th] = { tahun: th };
      grouped[th][usaha] = val;
    });

    setChartData(Object.values(grouped));
    if (data[0]?.sumber) setSumber(data[0].sumber);
  }, [data]);

  // palet warna kontras
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
            {/* Judul */}
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                textAlign: 'center',
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Laju Pertumbuhan PDRB ADHK Menurut Lapangan Usaha di Kabupaten Sumba Barat
            </Typography>

            {/* Dropdown Filter */}
            <FormControl size="small" sx={{ minWidth: 250, mb: 3 }}>
              <InputLabel id="usaha-select-label">Pilih Lapangan Usaha</InputLabel>
              <Select
                labelId="usaha-select-label"
                value={selectedUsaha}
                label="Pilih Lapangan Usaha"
                onChange={(e) => setSelectedUsaha(e.target.value)}
              >
                <MenuItem value="ALL">Tampilkan Semua</MenuItem>
                {usahaList.map((u, i) => (
                  <MenuItem key={i} value={u}>
                    {u}
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
                  <YAxis domain={['auto', 'auto']} tickFormatter={(val) => `${val.toFixed(1)}%`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Box
                            sx={{
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              p: 1
                            }}
                          >
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
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '4px 0',
                                cursor: 'pointer'
                              }}
                            >
                              <div
                                style={{
                                  width: 14,
                                  height: 14,
                                  backgroundColor: entry.color,
                                  marginRight: 6,
                                  borderRadius: 3
                                }}
                              />
                              <span style={{ fontSize: '0.8rem', color: '#444' }}>{entry.value}</span>
                            </div>
                          </MuiTooltip>
                        ))}
                      </div>
                    )}
                  />

                  {(selectedUsaha === 'ALL' ? usahaList : [selectedUsaha]).map((usaha, idx) => (
                    <Line
                      key={usaha}
                      type="monotone"
                      dataKey={usaha}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={usaha}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Sumber */}
            {sumber && (
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  display: 'block',
                  textAlign: 'left',
                  fontStyle: 'italic',
                  color: 'text.secondary'
                }}
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

LajuPDRBLineChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool
};
