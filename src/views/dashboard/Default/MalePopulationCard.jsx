import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MaleIcon from '@mui/icons-material/Male';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

export default function MalePopulationCard({ isLoading }) {
  const theme = useTheme();
  const [malePopulation, setMalePopulation] = useState(0);

  // Fetch data dan hitung jumlah penduduk laki-laki
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        // Asumsi tiap item punya field "penduduk laki"
        const total = jsonData.reduce((acc, curr) => acc + Number(curr['penduduk laki'] || 0), 0);
        setMalePopulation(total);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: theme.palette.primary.dark, // Biru muda
            color: theme.palette.primary.contrastText,
            overflow: 'hidden',
            position: 'relative',
            textAlign: 'center',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column" alignItems="center" spacing={1}>
              <Grid>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: theme.palette.primary[800],
                    mb: 1,
                    color: '#fff'
                  }}
                >
                  <MaleIcon fontSize="large" />
                </Avatar>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>{malePopulation.toLocaleString('id-ID')}</Typography>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: theme.palette.primary.contrastText }}>
                  Penduduk Laki-Laki Kab. Sumba Barat
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

MalePopulationCard.propTypes = {
  isLoading: PropTypes.bool
};
