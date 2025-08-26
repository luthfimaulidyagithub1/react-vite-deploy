// BarProduktivitasTanamanPanganCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

export default function BarProduktivitasTanamanPanganCard({ isLoading, data, tahun, kecamatan }) {
  const [chartData, setChartData] = useState([]);
  const [sumber, setSumber] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:600px)');

  // palet warna
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    '#FF9800' // orange custom
  ];

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    const toNumber = (val) => {
      if (!val) return 0;
      if (typeof val === 'string') {
        val = val.replace(/\./g, '').replace(',', '.').trim();
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // pisahkan data produksi & luas panen
    const produksi = {};
    const luas = {};

    filtered.forEach((item) => {
      const jenis = item['jenis tanaman'] || 'Tidak diketahui';
      const kategori = String(item.kategori).toLowerCase().trim();
      const nilai = toNumber(item['nilai']);

      if (kategori === 'produksi (ton)') {
        if (!produksi[jenis]) produksi[jenis] = 0;
        produksi[jenis] += nilai;
      } else if (kategori === 'luas panen (ha)') {
        if (!luas[jenis]) luas[jenis] = 0;
        luas[jenis] += nilai;
      }
    });

    // hitung produktivitas = produksi ÷ luas panen
    // hitung produktivitas = produksi ÷ luas panen
    const result = Object.keys(produksi).map((jenis) => {
      const prod = produksi[jenis] || 0;
      const lsp = luas[jenis] || 0;
      const produktivitas = lsp > 0 ? prod / lsp : 0;
      return {
        name: jenis,
        jumlah: produktivitas
      };
    });

    // urutkan dari produktivitas tertinggi
    result.sort((a, b) => b.jumlah - a.jumlah);

    setChartData(result);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    }
  }, [data, tahun, kecamatan]);

  return (
    <Card sx={{ borderRadius: 2, height: '100%', border: (theme) => `2px solid ${theme.palette.grey[100]}` }}>
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
          Produktivitas Tanaman Pangan (Ton/Ha) di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={isSmall ? 100 : 140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => `${val.toFixed(2)} ton/ha`} />

              <Bar dataKey="jumlah" name="Produktivitas">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.jumlah > 0 ? COLORS[index % COLORS.length] : 'transparent'} />
                ))}
                <LabelList
                  dataKey="jumlah"
                  position="right"
                  formatter={(val) => `${val.toFixed(2)}`}
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

BarProduktivitasTanamanPanganCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
