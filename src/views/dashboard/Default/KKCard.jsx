import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import GroupsIcon from '@mui/icons-material/Groups'; // Ikon untuk KK

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

export default function KKCard({ isLoading }) {
  const theme = useTheme();
  const [totalKK, setTotalKK] = useState(0);

  // Fetch data dan hitung total KK
  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    })
      .then((res) => res.json())
      .then((jsonData) => {
        const total = jsonData.reduce((acc, curr) => acc + Number(curr.kk), 0);
        setTotalKK(total);
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
            bgcolor: 'primary.dark',
            color: '#fff',
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
                    bgcolor: 'primary.800',
                    mb: 1,
                    color: '#fff' // Warna icon putih
                  }}
                >
                  <GroupsIcon fontSize="large" />
                </Avatar>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '2rem', fontWeight: 500 }}>{totalKK.toLocaleString('id-ID')}</Typography>
              </Grid>

              <Grid>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: 'primary.200' }}>Jumlah KK Kab. Sumba Barat</Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

KKCard.propTypes = {
  isLoading: PropTypes.bool
};
