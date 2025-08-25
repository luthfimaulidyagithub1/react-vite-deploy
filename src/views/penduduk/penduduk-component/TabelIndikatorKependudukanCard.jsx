// src/ui-component/cards/statistik/TabelIndikatorKependudukanCard.jsx

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
  TableSortLabel,
  Box
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export default function TabelIndikatorKependudukanCard({ isLoading, data, tahun, kecamatan }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    // filter berdasarkan tahun dan kecamatan
    let filtered = data.filter((item) => String(item.tahun) === String(tahun) && String(item.kecamatan) === String(kecamatan));

    setTableData(filtered);

    // ambil sumber
    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else if (data[0]?.sumber) {
      setSumber(data[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun, kecamatan]);

  // fungsi sort comparator
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = orderBy !== '' ? [...tableData].sort(getComparator(order, orderBy)) : tableData;

  // format ribuan pakai titik, desimal koma, 2 angka belakang koma
  const formatDecimal = (val, digits = 2) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(num);
  };

  // format integer dengan pemisah ribuan
  const formatInteger = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const headCells = [
    { id: 'no', label: 'No', align: 'center', disableSort: true },
    { id: 'deskel', label: 'Desa / Kelurahan', align: 'left' },
    { id: 'kk', label: 'KK', align: 'center' },
    { id: 'jumlah', label: 'Penduduk', align: 'center' }, // ✅ kolom baru
    { id: 'persentase penduduk', label: 'Persentase Penduduk (%)', align: 'center' },
    { id: 'kepadatan penduduk (per km2)', label: 'Kepadatan Penduduk (per km²)', align: 'center' },
    { id: 'rasio jk', label: 'Rasio Jenis Kelamin', align: 'center' }
  ];

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}>
          Indikator Kependudukan menurut Desa di Kecamatan {kecamatan}, {tahun}
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
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                          backgroundColor: (theme) => `${theme.palette.grey[600]} !important`,
                          color: (theme) => `${theme.palette.secondary.contrastText} !important`,
                          fontWeight: 'bold !important',
                          fontSize: '0.7rem !important',
                          padding: '2px 6px !important',
                          lineHeight: 1.2
                        }}
                      >
                        {headCell.disableSort ? (
                          headCell.label
                        ) : (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => handleRequestSort(headCell.id)}
                            sx={{
                              color: 'inherit !important',
                              '&:hover': { color: 'inherit !important' },
                              '& .MuiTableSortLabel-icon': {
                                color: 'inherit !important'
                              }
                            }}
                          >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
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
                        {row.deskel}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {formatInteger(row.kk)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {formatInteger(row.jumlah)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {formatDecimal(row['persentase penduduk'])}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {formatDecimal(row['kepadatan penduduk (per km2)'])}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                        {formatInteger(row['rasio jk'])}
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

TabelIndikatorKependudukanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
