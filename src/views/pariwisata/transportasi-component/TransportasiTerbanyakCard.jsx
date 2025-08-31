// TransportasiTerbanyakCard.jsx
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
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(33, 150, 243, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(33, 150, 243, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function TransportasiTerbanyakCard({ isLoading, data, tahun, kecamatan }) {
  const theme = useTheme();
  const [jenisTerbanyak, setJenisTerbanyak] = useState('-');
  const [jumlah, setJumlah] = useState(0);
  const [sumber, setSumber] = useState(null);

  const handleClick = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), 2000);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    if (filtered.length === 0) {
      setJenisTerbanyak('-');
      setJumlah(0);
      setSumber(null);
      return;
    }

    // hitung frekuensi berdasarkan field "jenis sarana transportasi"
    const freq = {};
    filtered.forEach((item) => {
      const jenis = String(item['jenis sarana transportasi'] || '-').trim();
      if (!jenis || jenis === '-') return;
      freq[jenis] = (freq[jenis] || 0) + 1;
    });

    // ambil yang terbanyak
    let maxJenis = '-';
    let maxCount = 0;
    Object.entries(freq).forEach(([jenis, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxJenis = jenis;
      }
    });

    setJenisTerbanyak(maxJenis);
    setJumlah(maxCount);

    // ambil sumber
    const sumberValues = [...new Set(filtered.map((item) => item.sumber))];
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
                      bgcolor: alpha(theme.palette.primary.light, 0.85),
                      color: theme.palette.primary.dark
                    }}
                  >
                    <DirectionsBusIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#000' }}>
                      {jenisTerbanyak !== '-' ? `${jenisTerbanyak} (${jumlah} desa)` : 'Data belum tersedia'}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Sarana Transportasi Terbanyak di Kec. {kecamatan}, {tahun}
                      </Typography>
                      <Tooltip title={sumber ? sumber : 'Sumber tidak tersedia'}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            mt: 0.5,
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.main,
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

TransportasiTerbanyakCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
