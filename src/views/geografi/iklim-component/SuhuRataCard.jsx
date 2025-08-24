// src/ui-component/cards/statistik/SuhuRataCard.jsx
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
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.error.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.error.dark} -50.94%, rgba(76, 175, 80, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.error.dark} -14.02%, rgba(76, 175, 80, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function SuhuRataCard({ isLoading, data, tahun }) {
  const theme = useTheme();
  const [suhuRata, setSuhuRata] = useState(null);
  const [sumber, setSumber] = useState(null);

  const handleClick = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), 2000); // otomatis nutup setelah 2 detik
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // filter sesuai tahun
    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    if (filtered.length > 0) {
      // hitung rata-rata dari field "suhu rata (celcius)"
      const total = filtered.reduce((sum, item) => sum + (parseFloat(item['suhu rata (celcius)']) || 0), 0);
      const avg = total / filtered.length;

      setSuhuRata(avg.toFixed(2)); // tampilkan 2 digit desimal

      // ambil sumber (asumsi sama untuk semua baris)
      setSumber(filtered[0].sumber || null);
    }
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
                      bgcolor: alpha(theme.palette.error.light, 0.85),
                      color: theme.palette.error.dark
                    }}
                  >
                    <DeviceThermostatIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#000' }}>
                      {suhuRata ? `${suhuRata} °C` : '-'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Suhu Rata-Rata, {tahun}
                      </Typography>
                      {/* Tombol sumber dengan tooltip */}
                      <Tooltip title={sumber ? sumber : 'Sumber tidak tersedia'}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mt: 0.5,
                            backgroundColor: theme.palette.error.light,
                            color: theme.palette.error.dark,
                            '&:hover': {
                              backgroundColor: theme.palette.error.main,
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

SuhuRataCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
