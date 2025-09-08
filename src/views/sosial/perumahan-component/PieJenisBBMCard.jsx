// PieJenisBBMCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

const getTextColor = (hex) => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#000' : '#fff';
};

export default function PieJenisBBMCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && String(item.kecamatan).toLowerCase() === String(kecamatan).toLowerCase()
    );

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const grouped = {};
    filtered.forEach((f) => {
      const jenis = String(f['jenis bahan bakar memasak'] || 'Tidak diketahui').trim();
      const jumlah = toNumber(f['jumlah desa']);
      if (!grouped[jenis]) grouped[jenis] = 0;
      grouped[jenis] += jumlah;
    });

    const result = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key]
    }));

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8e44ad',
    '#16a085',
    '#d35400'
  ];

  // Label → hanya persentase dan jumlah
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    if (value === 0) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
        {(percent * 100).toFixed(1)}% ({value})
      </text>
    );
  };

  // Legend → filter hanya yang value > 0
  const filteredLegend = chartData.filter((d) => d.value > 0);

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.grey[200]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Distribusi Jumlah Desa menurut Jenis Bahan Bakar Memasak di Kecamatan {kecamatan}, {tahun}
        </Typography>

        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box sx={{ flex: 1, height: 280 }}>
            {filteredLegend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ fontSize: 12 }}
                    payload={filteredLegend.map((item, index) => ({
                      id: item.name,
                      type: 'square',
                      value: item.name,
                      color: colors[index % colors.length]
                    }))}
                  />
                  <Pie
                    data={filteredLegend}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    paddingAngle={0}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {filteredLegend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString('id-ID')} Desa`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada data
              </Typography>
            )}
          </Box>
        </Box>

        {sumber && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
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

PieJenisBBMCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
