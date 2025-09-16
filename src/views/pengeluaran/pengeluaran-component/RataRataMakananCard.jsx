// RataRataMakananCard.jsx
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
import RestaurantIcon from '@mui/icons-material/Restaurant';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.info.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.info.dark} -50.94%, rgba(33, 150, 243, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.info.dark} -14.02%, rgba(33, 150, 243, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function RataRataMakananCard({ isLoading, data, tahun }) {
  const theme = useTheme();
  const [rataMakanan, setRataMakanan] = useState(0);
  const [persenMakanan, setPersenMakanan] = useState(0);
  const [sumber, setSumber] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // total semua kategori
    const totalSemua = filtered.reduce((sum, item) => {
      let val = item['rata-rata pengeluaran (rupiah)'] ?? 0;
      if (typeof val === 'string') val = val.replace(',', '.').trim();
      const num = parseFloat(val);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    // khusus kategori makanan
    const totalMakanan = filtered
      .filter((item) => String(item.kategori).toLowerCase() === 'makanan')
      .reduce((sum, item) => {
        let val = item['rata-rata pengeluaran (rupiah)'] ?? 0;
        if (typeof val === 'string') val = val.replace(',', '.').trim();
        const num = parseFloat(val);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

    setRataMakanan(totalMakanan);
    setPersenMakanan(totalSemua > 0 ? (totalMakanan / totalSemua) * 100 : 0);

    // ambil sumber
    const sumberValues = [...new Set(filtered.map((item) => item.sumber))];
    setSumber(sumberValues.length > 0 ? sumberValues[0] : null);
  }, [data, tahun]);

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
                      bgcolor: alpha(theme.palette.info.light, 0.85),
                      color: theme.palette.info.dark
                    }}
                  >
                    <RestaurantIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#000' }}>
                      {rataMakanan > 0 ? `Rp ${rataMakanan.toLocaleString('id-ID')}` : 'Belum ada data'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Rata-rata Pengeluaran Makanan Per Kapita (Per Orang) Sebulan, {tahun}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.info.dark, fontWeight: 'bold' }}>
                        {persenMakanan.toFixed(2)}% dari total pengeluaran
                      </Typography>
                      <Tooltip title={sumber ? sumber : 'Sumber tidak tersedia'}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mt: 0.5,
                            backgroundColor: theme.palette.info.light,
                            color: theme.palette.info.dark,
                            '&:hover': {
                              backgroundColor: theme.palette.info.main,
                              color: '#fff'
                            },
                            textTransform: 'none',
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            minWidth: 'unset'
                          }}
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

RataRataMakananCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
