// src/ui-component/cards/statistik/TabelTenagaKesehatanCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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
  TableSortLabel
} from '@mui/material';

export default function TabelTenagaKesehatanCard({ isLoading, data, tahun }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kecamatan');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter((item) => String(item.tahun) === String(tahun));

    const grouped = {};
    filtered.forEach((item) => {
      const kec = item.kecamatan;
      const jenis = item['tenaga kesehatan'];
      const jumlah = Number(item.jumlah) || 0;

      if (!grouped[kec]) grouped[kec] = { kecamatan: kec, jumlahTotal: 0 };
      grouped[kec][jenis] = (grouped[kec][jenis] || 0) + jumlah;
      grouped[kec].jumlahTotal += jumlah;
    });

    setTableData(Object.values(grouped));

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun]);

  const tenagaKesehatanList = Array.from(new Set(data?.map((d) => d['tenaga kesehatan'])));

  const formatInteger = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // fungsi sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...tableData].sort((a, b) => {
    const valA = a[orderBy] || 0;
    const valB = b[orderBy] || 0;
    if (typeof valA === 'string') {
      return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return order === 'asc' ? valA - valB : valB - valA;
  });

  // hitung total per jenis tenaga kesehatan dan total keseluruhan
  const totalPerJenis = {};
  let grandTotal = 0;
  sortedData.forEach((row) => {
    tenagaKesehatanList.forEach((jenis) => {
      totalPerJenis[jenis] = (totalPerJenis[jenis] || 0) + (row[jenis] || 0);
    });
    grandTotal += row.jumlahTotal;
  });

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            textAlign: 'center'
          }}
        >
          Jumlah Tenaga Pelayanan Kesehatan di Kabupaten Sumba Barat, {tahun}
        </Typography>

        {tableData.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                border: (theme) => `1px solid ${theme.palette.grey[600]}`
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: theme.palette.grey[600],
                        color: `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        padding: '2px 6px'
                      }}
                    >
                      No
                    </TableCell>

                    {/* Kolom Kecamatan */}
                    <TableCell
                      align="left"
                      sortDirection={orderBy === 'kecamatan' ? order : false}
                      sx={{
                        backgroundColor: theme.palette.grey[600],
                        color: `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'kecamatan'}
                        direction={orderBy === 'kecamatan' ? order : 'asc'}
                        onClick={() => handleSort('kecamatan')}
                        sx={{
                          color: 'inherit !important',
                          '&:hover': { color: 'inherit !important' },
                          '& .MuiTableSortLabel-icon': {
                            color: 'inherit !important'
                          }
                        }}
                      >
                        Kecamatan
                      </TableSortLabel>
                    </TableCell>

                    {/* Kolom Dinamis */}
                    {tenagaKesehatanList.map((jenis, i) => (
                      <TableCell
                        key={i}
                        align="center"
                        sortDirection={orderBy === jenis ? order : false}
                        sx={{
                          backgroundColor: theme.palette.grey[600],
                          color: `${theme.palette.secondary.contrastText} !important`,
                          fontWeight: 'bold !important',
                          fontSize: '0.7rem !important',
                          padding: '2px 6px !important',
                          lineHeight: 1.2
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === jenis}
                          direction={orderBy === jenis ? order : 'asc'}
                          onClick={() => handleSort(jenis)}
                          sx={{
                            color: 'inherit !important',
                            '&:hover': { color: 'inherit !important' },
                            '& .MuiTableSortLabel-icon': {
                              color: 'inherit !important'
                            }
                          }}
                        >
                          {jenis}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                    {/* Kolom Jumlah Total */}
                    <TableCell
                      align="center"
                      sortDirection={orderBy === 'jumlahTotal' ? order : false}
                      sx={{
                        backgroundColor: theme.palette.grey[600],
                        color: `${theme.palette.secondary.contrastText} !important`,
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'jumlahTotal'}
                        direction={orderBy === 'jumlahTotal' ? order : 'asc'}
                        onClick={() => handleSort('jumlahTotal')}
                        sx={{
                          color: 'inherit !important',
                          '&:hover': { color: 'inherit !important' },
                          '& .MuiTableSortLabel-icon': {
                            color: 'inherit !important'
                          }
                        }}
                      >
                        Jumlah
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: '0.75rem' }}>
                        {row.kecamatan}
                      </TableCell>
                      {tenagaKesehatanList.map((jenis, i) => (
                        <TableCell key={i} align="right" sx={{ fontSize: '0.75rem' }}>
                          {formatInteger(row[jenis])}
                        </TableCell>
                      ))}
                      <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {formatInteger(row.jumlahTotal)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Baris total */}
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.grey[200]
                    }}
                  >
                    <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 600 }} colSpan={2}>
                      Total
                    </TableCell>
                    {tenagaKesehatanList.map((jenis, i) => (
                      <TableCell key={i} align="right" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {formatInteger(totalPerJenis[jenis])}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      {formatInteger(grandTotal)}
                    </TableCell>
                  </TableRow>
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
                  fontStyle: 'italic'
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

TabelTenagaKesehatanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
