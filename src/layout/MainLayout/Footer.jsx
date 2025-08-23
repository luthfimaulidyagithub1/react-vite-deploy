import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        alignItems: { xs: 'flex-start', md: 'flex-start' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        pt: 3,
        pb: 2, // lebih rapat ke bawah
        px: { xs: 2, md: 6 },
        mt: 'auto',
        bgcolor: 'grey.100'
      }}
      spacing={2}
    >
      {/* Kiri: Informasi BPS */}
      <Stack direction="column" spacing={0.6} sx={{ maxWidth: 600 }}>
        <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 600, lineHeight: 1.6 }}>
          Badan Pusat Statistik Kabupaten Sumba Barat <i>(Statistics of Sumba Barat Regency)</i>
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.600', lineHeight: 1.6 }}>
          Jl. Wee Karou, Kec. Loli, Kabupaten Sumba Barat, Nusa Tenggara Timur
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.600', lineHeight: 1.6 }}>
          Telp : (0387) 21256
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.600', lineHeight: 1.6 }}>
          Email: bps5301@bps.go.id
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.600', lineHeight: 1.6 }}>
          Website:{' '}
          <Link
            component={RouterLink}
            to="https://sumbabaratkab.bps.go.id"
            underline="hover"
            target="_blank"
            sx={{ color: 'primary.main', fontWeight: 500 }}
          >
            https://sumbabaratkab.bps.go.id
          </Link>
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 600, lineHeight: 1.6 }}>
          Hak Cipta © Badan Pusat Statistik Kabupaten Sumba Barat
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'grey.600', lineHeight: 1.6, mb: 0 }} // rapat tanpa margin bawah
        >
          Semua Hak Dilindungi
        </Typography>
      </Stack>

      {/* Kanan: link tambahan */}
      <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
        <Link
          component={RouterLink}
          to="https://sumbabaratkab.bps.go.id"
          underline="hover"
          target="_blank"
          variant="caption"
          sx={{ color: 'primary.main', fontWeight: 500 }}
        >
          Website
        </Link>
        <Link
          component={RouterLink}
          to="mailto:bps5301@bps.go.id"
          underline="hover"
          target="_blank"
          variant="caption"
          sx={{ color: 'primary.main', fontWeight: 500 }}
        >
          Email
        </Link>
      </Stack>
    </Stack>
  );
}
