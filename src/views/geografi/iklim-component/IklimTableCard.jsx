// src/ui-component/cards/statistik/IklimTableCard.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton
} from '@mui/material';

const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()/%]/g, '');

export default function IklimTableCard({ data = [], tahun, indikator = '', isLoading = false }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0 || !indikator) return;

    const filtered = data.filter((item) => String(item?.tahun) === String(tahun));
    if (filtered.length === 0) return;

    let fieldBase = '';
    const indikatorLower = indikator.toLowerCase();
    if (indikatorLower.includes('suhu')) fieldBase = 'suhu';
    else if (indikatorLower.includes('kelembaban')) fieldBase = 'kelembaban';
    else if (indikatorLower.includes('angin')) fieldBase = 'angin';
    else if (indikatorLower.includes('udara')) fieldBase = 'udara';

    const mapped = filtered.map((item) => {
      const keys = Object.keys(item || {});
      const minKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('min'));
      const rataKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('rata'));
      const maxKey = keys.find((k) => normalize(k).includes(fieldBase) && normalize(k).includes('max'));

      return {
        bulan: item?.bulan || '',
        min: minKey ? parseFloat(item[minKey]) : null,
        rata: rataKey ? parseFloat(item[rataKey]) : null,
        max: maxKey ? parseFloat(item[maxKey]) : null
      };
    });

    setTableData(mapped);
    setSumber(filtered[0]?.sumber || null);
  }, [data, tahun, indikator]);

  return (
    <Card
      sx={{
        // border: (theme) => `2px solid ${theme.palette.grey[200]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Tabel {indikator} per Bulan di Stasiun Umbu Mehang Kunda, {tahun}
        </Typography>

        {isLoading ? (
          <div>
            <Skeleton variant="text" width={250} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </div>
        ) : tableData.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 450,
                border: (theme) => `1px solid ${theme.palette.grey[600]}`
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Bulan', 'Minimum', 'Rata-Rata', 'Maksimum'].map((header, idx) => (
                      <TableCell
                        key={idx}
                        align={idx === 0 ? 'center' : 'center'}
                        sx={{
                          backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                          color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                          fontWeight: 'bold !important',
                          fontSize: '0.7rem !important',
                          padding: '2px 6px !important',
                          lineHeight: 1.2
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.bulan}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {row.min != null ? row.min.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {row.rata != null ? row.rata.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {row.max != null ? row.max.toFixed(2) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {sumber && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: 'block',
                  textAlign: 'left',
                  fontStyle: 'italic',
                  fontSize: '0.45rem'
                }}
              >
                Sumber: {sumber}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Belum ada data
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

IklimTableCard.propTypes = {
  data: PropTypes.array,
  tahun: PropTypes.string,
  indikator: PropTypes.string,
  isLoading: PropTypes.bool
};
