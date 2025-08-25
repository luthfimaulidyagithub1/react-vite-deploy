import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { alpha, styled, useTheme } from '@mui/material/styles';
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
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  //   backgroundColor: theme.palette.primary.dark,
  //   color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function PopulationDensityCard({ isLoading }) {
  const theme = useTheme();
  const [density, setDensity] = useState(0);
  const [year, setYear] = useState(null);

  useEffect(() => {
    fetch('https://luthfimaulidyagithub1.github.io/DDA-json/latlong_wil.json', {
      // headers: { Accept: 'application/vnd.github.v3.raw' }
      // Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (!jsonData || jsonData.length === 0) return;

        const tahunUnik = [...new Set(jsonData.map((d) => d.tahun))].sort();
        const maxYear = tahunUnik[tahunUnik.length - 1];
        setYear(maxYear);

        const dataTahun = jsonData.filter((d) => d.tahun === maxYear);
        const totalPopulation = dataTahun.reduce((acc, curr) => acc + Number(curr.penduduk), 0);
        const totalArea = dataTahun.reduce((acc, curr) => acc + Number(curr['luas desa (km2)']), 0);

        const densityValue = totalArea > 0 ? totalPopulation / totalArea : 0;
        setDensity(densityValue);
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
              ? `Pada tahun ${year}, rata-rata terdapat sekitar ${Math.ceil(density).toLocaleString('id-ID')} penduduk yang tinggal di setiap 1 km² wilayah Kab. Sumba Barat.`
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
                        bgcolor: alpha(theme.palette.primary.light, 0.85),
                        color: theme.palette.primary.dark
                      }}
                    >
                      <TableChartOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                    primary={
                      <Typography variant="h4" sx={{ color: '#000' }}>
                        {density.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / km²
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Kepadatan Penduduk Kab. Sumba Barat
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

PopulationDensityCard.propTypes = { isLoading: PropTypes.bool };
