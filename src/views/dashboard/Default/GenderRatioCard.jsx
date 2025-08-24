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

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import MaleIcon from '@mui/icons-material/Male';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(255, 193, 7, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(255, 193, 7, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function GenderRatioLightCard({ isLoading }) {
  const theme = useTheme();
  const [ratio, setRatio] = useState(0);
  const [year, setYear] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (!jsonData || jsonData.length === 0) return;

        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        const maxYear = tahunUnik[tahunUnik.length - 1];
        setYear(maxYear);

        const dataTahun = jsonData.filter((d) => d.tahun === maxYear);

        const totalMale = dataTahun.reduce((acc, curr) => acc + Number(curr['penduduk laki']), 0);
        const totalFemale = dataTahun.reduce((acc, curr) => acc + Number(curr['penduduk perempuan']), 0);

        const ratioValue = totalFemale > 0 ? (totalMale / totalFemale) * 100 : 0;
        setRatio(ratioValue);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <Tooltip
          title={
            year
              ? `Pada tahun ${year}, terdapat sekitar  ${ratio.toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })} penduduk laki-laki untuk 100 perempuan di Kabupaten Sumba Barat`
              : ''
          }
          arrow
          placement="top"
        >
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
                        color: theme.palette.warning.dark // Icon kuning
                      }}
                    >
                      <MaleIcon fontSize="inherit" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                    primary={
                      <Typography variant="h4" sx={{ color: '#000' }}>
                        {ratio.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Rasio Jenis Kelamin Penduduk Kab. Sumba Barat
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </CardWrapper>
        </Tooltip>
      )}
    </>
  );
}

GenderRatioLightCard.propTypes = { isLoading: PropTypes.bool };
