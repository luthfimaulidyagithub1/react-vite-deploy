import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

export default function PopulationCard({ isLoading }) {
  const theme = useTheme();
  const [totalPopulation, setTotalPopulation] = useState(0);

  // Fetch data dan hitung total penduduk
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        const total = jsonData.reduce((acc, curr) => acc + Number(curr.penduduk), 0);
        setTotalPopulation(total);
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
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            textAlign: 'center',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
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
                    bgcolor: 'secondary.800',
                    mb: 1,
                    color: '#fff' // Warna icon putih
                  }}
                >
                  <PeopleAltIcon fontSize="large" />
                </Avatar>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '2rem', fontWeight: 500 }}>{totalPopulation.toLocaleString('id-ID')}</Typography>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: 'secondary.200' }}>Penduduk Kab. Sumba Barat</Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

PopulationCard.propTypes = {
  isLoading: PropTypes.bool
};
