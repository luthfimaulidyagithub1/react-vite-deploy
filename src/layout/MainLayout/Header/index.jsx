// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import bpsLogo from 'assets/images/bps-logo.png';

// tambahan
import { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // state untuk link pdf semua publikasi
  const [pdfLinks, setPdfLinks] = useState({
    sumbaBarat: null,
    waikabubak: null,
    laboya: null,
    lamboya: null,
    loli: null,
    tanaRighu: null,
    wanokaka: null
  });

  // mapping keyword -> state key
  const publikasiList = [
    {
      key: 'sumbaBarat',
      label: 'Kabupaten Sumba Barat Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kabupaten+Sumba+Barat+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'waikabubak',
      label: 'Kecamatan Kota Waikabubak Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Kota+Waikabubak+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'laboya',
      label: 'Kecamatan Laboya Barat Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Laboya+Barat+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'lamboya',
      label: 'Kecamatan Lamboya Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Lamboya+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'loli',
      label: 'Kecamatan Loli Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Loli+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'tanaRighu',
      label: 'Kecamatan Tana Righu Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Tana+Righu+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    },
    {
      key: 'wanokaka',
      label: 'Kecamatan Wanokaka Dalam Angka',
      url: 'https://webapi.bps.go.id/v1/api/list/model/publication/domain/5301/keyword/Kecamatan+Wanokaka+Dalam+Angka/key/ac6a1cda75ba33256a2caf5ad9511ccd/'
    }
  ];

  // ambil semua pdf paralel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          publikasiList.map(async (pub) => {
            const res = await fetch(pub.url);
            const json = await res.json();
            const pdfLink = json?.data?.[1]?.[0]?.pdf || null;
            return { key: pub.key, pdf: pdfLink };
          })
        );

        const newLinks = {};
        results.forEach((r) => {
          newLinks[r.key] = r.pdf;
        });
        setPdfLinks(newLinks);
      } catch (err) {
        console.error('Gagal ambil publikasi:', err);
      }
    };
    fetchAll();
  }, []);

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

      {/* button Saran Masukan */}
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
          '&:hover': { bgcolor: theme.palette.primary.dark },
          '& .MuiChip-label': { lineHeight: 1 }
        }}
        label="Saran & Masukan"
        component="a"
        href="https://docs.google.com/forms/d/e/1FAIpQLSdZfDkJ0Tnnwmw0pdvILTq7rUKVq-sS1MuzBNPWT4joOyPIIg/viewform?usp=preview"
        target="_blank"
        aria-label="Saran & Masukan"
      />

      {/* space */}
      <Box sx={{ flexGrow: 1 }} />

      {/* dropdown Publikasi BPS */}
      <>
        <Chip
          color="secondary"
          sx={{
            ml: 2,
            height: '48px',
            alignItems: 'center',
            borderRadius: '27px',
            cursor: 'pointer',
            fontWeight: 'bold',
            bgcolor: theme.palette.secondary[200],
            color: theme.palette.secondary.contrastText,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
            '& .MuiChip-label': { lineHeight: 1 }
          }}
          label={
            <>
              Publikasi BPS
              <span
                style={{
                  display: 'inline-block',
                  transition: 'transform 0.2s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▾
              </span>
            </>
          }
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-controls={open ? 'publikasi-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        />
        <Menu
          id="publikasi-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.background.paper,
              '& .MuiMenuItem-root': {
                transition: 'all 0.2s ease-in-out',
                // borderRadius: '8px',
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark
                  }
                }
              }
            }
          }}
        >
          {publikasiList.map((pub) => (
            <MenuItem key={pub.key} component="a" href={pdfLinks[pub.key] || '#'} target="_blank" disabled={!pdfLinks[pub.key]}>
              {pub.label}
            </MenuItem>
          ))}
        </Menu>
      </>

      {/* Logo BPS + Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Box component="img" src={bpsLogo} alt="BPS Logo" sx={{ height: 40, width: 'auto', mr: { xs: 0, md: 1 }, objectFit: 'contain' }} />
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'black', lineHeight: 1.2, display: { xs: 'none', md: 'block' } }}>
          <i>
            BADAN PUSAT STATISTIK
            <br />
            KABUPATEN SUMBA BARAT
          </i>
        </Typography>
      </Box>
    </>
  );
}
