// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import SearchSection from './SearchSection';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';
import bpsLogo from 'assets/images/bps-logo.png';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ color: 'secondary.light', width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            '&:hover': {
              bgcolor: 'secondary.dark',
              color: 'secondary.light'
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* button Unduh Data Tabel */}
      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          cursor: 'pointer',
          fontWeight: 'bold',
          bgcolor: theme.palette.primary[200],
          color: theme.palette.primary.contrastText,
          '&:hover': {
            bgcolor: theme.palette.primary.dark
          },
          '& .MuiChip-label': {
            lineHeight: 1
          }
        }}
        label=" Lihat Data Tabel"
        component="a"
        href="https://docs.google.com/spreadsheets/d/1ZVlXo3W5Oy8iHjPK-IRhUrMJTt_qOrGBFpimrcvbbuw/edit?gid=1396414102#gid=1396414102"
        target="_blank"
        aria-label="Lihat Data Tabel"
      />
      {/* space */}
      <Box sx={{ flexGrow: 1 }} />

      {/* button Unduh Publikasi BPS */}
      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          cursor: 'pointer',
          fontWeight: 'bold',
          bgcolor: theme.palette.secondary[200],
          color: theme.palette.primary.contrastText,
          '&:hover': {
            bgcolor: theme.palette.secondary.dark
          },
          '& .MuiChip-label': {
            lineHeight: 1
          }
        }}
        label="Unduh Publikasi BPS"
        component="a"
        href="https://sumbabaratkab.bps.go.id/id/publication"
        target="_blank"
        aria-label="Unduh Publikasi BPS"
      />
      {/* Logo BPS + Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Box
          component="img"
          src={bpsLogo}
          alt="BPS Logo"
          sx={{
            height: 40, // tinggi fix
            width: 'auto',
            mr: { xs: 0, md: 1 }, // kalau kecil margin hilang
            objectFit: 'contain',
            display: 'block'
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            color: 'black',
            lineHeight: 1.2,
            display: { xs: 'none', md: 'block' } // ⬅️ hanya muncul di md ke atas
          }}
        >
          <i>
            BADAN PUSAT STATISTIK
            <br />
            KABUPATEN SUMBA BARAT
          </i>
        </Typography>
      </Box>

      {/* space */}
      {/* <Box sx={{ flexGrow: 0.5 }} /> */}
      {/* profile */}

      {/* profile */}
      {/* <ProfileSection /> */}
    </>
  );
}
