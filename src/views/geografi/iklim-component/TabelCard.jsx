// src/ui-component/cards/statistik/TabelCard.jsx

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function TabelCard({ isLoading, data, tahun }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    // filter tahun saja
    let filtered = data.filter((item) => String(item.tahun) === String(tahun));
    setTableData(filtered);

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else if (data[0]?.sumber) {
      setSumber(data[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun]);

  return (
    <Card
      sx={{
        // border: (theme) => `2px solid ${theme.palette.grey[600]}`,
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'grey[600]' }}>
          Tabel Curah Hujan, Hari Hujan, dan Penyinaran Matahari di Stasiun Umbu Mehang Kunda, {tahun}
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
                    {['Bulan', 'Curah Hujan (mm)', 'Hari Hujan (hari)', 'Penyinaran Matahari (jam)'].map((header, idx) => (
                      <TableCell
                        key={idx}
                        align={idx > 1 ? 'center' : 'center'}
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
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.75rem' }}>{row.bulan}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {row['curah hujan (mm)'] ?? '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {row['hari hujan (hari)'] ?? '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {row['penyinaran matahari'] ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* sumber */}
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

TabelCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
