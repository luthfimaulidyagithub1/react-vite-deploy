import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FemaleIcon from '@mui/icons-material/Female';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

export default function FemalePopulationCard({ isLoading }) {
  const theme = useTheme();
  const [malePopulation, setMalePopulation] = useState(0);

  // Fetch data dan hitung jumlah penduduk perempuan
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
      .then((res) => res.json())
      .then((jsonData) => {
        // Asumsi tiap item punya field "penduduk perempuan"
        const total = jsonData.reduce((acc, curr) => acc + Number(curr['penduduk perempuan'] || 0), 0);
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
            bgcolor: theme.palette.orange.dark, // Biru muda
            color: theme.palette.orange.light,
            overflow: 'hidden',
            position: 'relative',
            textAlign: 'center',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.orange.main,
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.orange.main,
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
                    bgcolor: theme.palette.orange.main,
                    mb: 1,
                    color: '#fff'
                  }}
                >
                  <FemaleIcon fontSize="large" />
                </Avatar>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>{malePopulation.toLocaleString('id-ID')}</Typography>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: theme.palette.orange.light }}>
                  Penduduk perempuan Kab. Sumba Barat
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

FemalePopulationCard.propTypes = {
  isLoading: PropTypes.bool
};
