// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG (SIPADA) ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <svg
      width="150"
      height="37" // Ditingkatkan tingginya dari 32 menjadi 36
      viewBox="0 0 150 37" // Ditingkatkan tinggi viewBox-nya dari 32 menjadi 36
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bar chart */}
      <rect x="0" y="16" width="4" height="10" fill={theme.palette.primary.main} />
      <rect x="7" y="12" width="4" height="14" fill={theme.palette.secondary.main} />
      <rect x="14" y="8" width="4" height="18" fill={theme.palette.primary.main} />

      {/* Line chart path */}
      <path d="M2 18 L9 13 L16 9 L22 4" stroke={theme.palette.secondary.main} strokeWidth="2" fill="none" />
      {/* Dots on line */}
      <circle cx="2" cy="18" r="2" fill={theme.palette.secondary.main} />
      <circle cx="9" cy="13" r="2" fill={theme.palette.secondary.main} />
      <circle cx="16" cy="9" r="2" fill={theme.palette.secondary.main} />
      <circle cx="22" cy="4" r="2" fill={theme.palette.secondary.main} />

      {/* SIPADA text */}
      <text x="28" y="14" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="bold" fill={theme.palette.grey[900]}>
        SIPADA
      </text>

      {/* Subtext */}
      <text
        x="28"
        y="25" // Digeser ke bawah (dari 22) agar ada ruang yang baik antara baris
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fill={theme.palette.grey[700]}
      >
        Visualisasi Interaktif
      </text>
      <text
        x="28"
        y="34" // Digeser ke 30 (dari 28) untuk memastikan tidak terpotong di viewBox 36
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fill={theme.palette.grey[700]}
      >
        Publikasi Daerah Dalam Angka
      </text>
    </svg>
  );
}
