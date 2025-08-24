import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function TabelLuasDesaCard({ isLoading, data, tahun, kecamatan }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    // filter tahun
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));

    // filter kecamatan
    if (kecamatan && kecamatan !== 'Semua') {
      filtered = filtered.filter((item) => String(item.kecamatan).trim() === String(kecamatan).trim());
    }

    setTableData(filtered);

    // ambil sumber dari field "sumber"
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else if (data[0]?.sumber) {
      setSumber(data[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun, kecamatan]);

  return (
    <Card
      sx={{
        border: (theme) => `2px solid ${theme.palette.grey[600]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'grey[600]' }}>
          Tabel Luas Desa di {kecamatan}, {tahun}
        </Typography>

        {tableData.length > 0 ? (
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
                    <TableCell
                      sx={{
                        backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                        color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      No
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                        color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      Desa/Kelurahan
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                        color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      Luas Desa (km²)
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                        color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      % thd Luas Kec.
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.deskel}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {row['luas desa (km2)']}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {parseFloat(row['persentase terhadap luas kecamatan']).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* sumber di bawah kiri */}
            {sumber && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: 'block',
                  textAlign: 'left',
                  fontStyle: 'italic',
                  fontSize: '0.45rem' // lebih kecil dari caption default
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

TabelLuasDesaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
