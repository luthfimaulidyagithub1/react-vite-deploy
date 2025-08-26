// ProduktivitasPadiCard.jsx
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import RiceBowlIcon from '@mui/icons-material/RiceBowl';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.teal ? theme.palette.teal.main : theme.palette.warning.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(33, 150, 243, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(33, 150, 243, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function ProduktivitasPadiCard({ isLoading, data, tahun, kecamatan }) {
  const theme = useTheme();
  const [produktivitas, setProduktivitas] = useState(0);
  const [sumber, setSumber] = useState(null);

  const handleClick = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), 2000);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter Produksi (ton) untuk Padi
    let produksiData = data.filter(
      (item) =>
        String(item.kategori).toLowerCase().trim() === 'produksi (ton)' && String(item['jenis tanaman']).toLowerCase().trim() === 'padi'
    );
    produksiData = produksiData.filter((item) => String(item.tahun) === String(tahun));
    if (kecamatan && kecamatan !== 'Semua') {
      produksiData = produksiData.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }
    const totalProduksi = produksiData.reduce((sum, item) => {
      let val = item['nilai'] ?? 0;
      if (typeof val === 'string') val = val.replace(',', '.').trim();
      const num = parseFloat(val);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    // Filter Luas Panen (ha) untuk Padi
    let luasPanenData = data.filter(
      (item) =>
        String(item.kategori).toLowerCase().trim() === 'luas panen (ha)' && String(item['jenis tanaman']).toLowerCase().trim() === 'padi'
    );
    luasPanenData = luasPanenData.filter((item) => String(item.tahun) === String(tahun));
    if (kecamatan && kecamatan !== 'Semua') {
      luasPanenData = luasPanenData.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }
    const totalLuasPanen = luasPanenData.reduce((sum, item) => {
      let val = item['nilai'] ?? 0;
      if (typeof val === 'string') val = val.replace(',', '.').trim();
      const num = parseFloat(val);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    // Hitung Produktivitas = Produksi / Luas Panen
    const hasil = totalLuasPanen > 0 ? totalProduksi / totalLuasPanen : 0;
    setProduktivitas(hasil);

    // Ambil sumber
    const sumberValues = [...new Set([...produksiData.map((i) => i.sumber), ...luasPanenData.map((i) => i.sumber)])];
    setSumber(sumberValues.length > 0 ? sumberValues[0] : null);
  }, [data, tahun, kecamatan]);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: alpha(theme.palette.warning.light, 0.85),
                      color: theme.palette.warning.dark
                    }}
                  >
                    <RiceBowlIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#000' }}>
                      {produktivitas > 0 ? `${produktivitas.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Ton/Ha` : '0 Ton/Ha'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Produktivitas Tanaman Padi di Kec. {kecamatan}, {tahun}
                      </Typography>
                      <Tooltip title={sumber ? sumber : 'Sumber tidak tersedia'}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mt: 0.5,
                            backgroundColor: theme.palette.warning.light,
                            color: theme.palette.warning.dark,
                            '&:hover': {
                              backgroundColor: theme.palette.warning.main,
                              color: '#fff'
                            },
                            textTransform: 'none',
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            minWidth: 'unset'
                          }}
                          onClick={handleClick}
                        >
                          Sumber
                        </Button>
                      </Tooltip>
                    </>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
}

ProduktivitasPadiCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
