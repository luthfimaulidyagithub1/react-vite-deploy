// IntroPopup.jsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';

import LogoSection from '../layout/MainLayout/LogoSection';

import judulImg from '../assets/images/judul.png'; // gambar utama
import bpsLogo from '../assets/images/bps-logo.png'; // logo BPS

const IntroPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    window.location.href = '/beranda/default';
  };

  return (
    <Dialog
      open={open}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: 'white'
        }
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          m: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        {/* header atas kiri-kanan */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 24 }, // lebih turun sedikit
            left: { xs: 30, sm: 80 }, // ada padding kiri
            right: { xs: 30, sm: 80 }, // ada padding kanan
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* kiri: LogoSection */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LogoSection />
          </Box>

          {/* kanan: logo BPS + teks */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              component="img"
              src={bpsLogo}
              alt="Logo BPS"
              sx={{
                height: { xs: 30, sm: 42 }, // pakai height biar proporsional
                width: 'auto', // biar tidak gepeng
                objectFit: 'contain'
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                color: 'black',
                lineHeight: 1.2,
                fontSize: { xs: '0.7rem', sm: '0.9rem' }
              }}
            >
              <i>
                BADAN PUSAT STATISTIK <br /> KABUPATEN SUMBA BARAT
              </i>
            </Typography>
          </Box>
        </Box>

        {/* gambar utama */}
        <Box
          component="img"
          src={judulImg}
          alt="Judul"
          sx={{
            mt: { xs: 2, sm: 1.5 }, // margin top lebih besar agar tidak ketutup header
            width: '100%',
            maxWidth: '1200px',
            height: 'auto',
            objectFit: 'contain',
            flexGrow: 1,
            px: { xs: 2, sm: 4 }
          }}
        />

        {/* tombol masuk dashboard */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 20, sm: 30 },
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleClose}
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              borderRadius: 3
            }}
          >
            Masuk Dashboard
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IntroPopup;
