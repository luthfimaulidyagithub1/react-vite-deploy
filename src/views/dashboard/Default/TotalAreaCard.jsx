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
import PublicIcon from '@mui/icons-material/Public';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.success.dark} -50.94%, rgba(76, 175, 80, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.success.dark} -14.02%, rgba(76, 175, 80, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function TotalAreaCard({ isLoading }) {
  const theme = useTheme();
  const [totalArea, setTotalArea] = useState(0);

  useEffect(() => {
    fetch('https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong_wil.json', {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (!jsonData || jsonData.length === 0) return;
        const luas = jsonData.reduce((acc, curr) => acc + Number(curr['luas desa (km2)']), 0);
        setTotalArea(luas);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <Tooltip
          title={`Total luas wilayah Kabupaten Sumba Barat adalah ${Math.ceil(totalArea).toLocaleString('id-ID')} km²`}
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
                        bgcolor: alpha(theme.palette.success.light, 0.85),
                        color: theme.palette.success.dark // Icon hijau
                      }}
                    >
                      <PublicIcon fontSize="inherit" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                    primary={
                      <Typography variant="h4" sx={{ color: '#000' }}>
                        {Math.ceil(totalArea).toLocaleString('id-ID')} km²
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" sx={{ color: '#000', mt: 0.25 }}>
                        Total Luas Wilayah Kab. Sumba Barat
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

TotalAreaCard.propTypes = { isLoading: PropTypes.bool };
