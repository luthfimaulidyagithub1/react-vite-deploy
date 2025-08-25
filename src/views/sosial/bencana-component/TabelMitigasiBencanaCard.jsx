// src/ui-component/cards/statistik/TabelMitigasiBencanaCard.jsx
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

export default function TabelMitigasiBencanaCard({ isLoading, data, tahun, kecamatan }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('deskel');
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    const filtered = data.filter(
      (item) => String(item.tahun) === String(tahun) && String(item.kecamatan).toLowerCase() === String(kecamatan).toLowerCase()
    );

    setTableData(filtered);

    if (filtered.length > 0 && filtered[0].sumber) {
      setSumber(filtered[0].sumber);
    } else {
      setSumber('');
    }
  }, [data, tahun, kecamatan]);

  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    return String(val);
  };

  // fungsi comparator
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedData = [...tableData].sort(getComparator(order, orderBy));

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const headCells = [
    { id: 'deskel', label: 'Desa / Kelurahan', align: 'left' },
    { id: 'SPD bencana alam', label: 'SPD Bencana Alam', align: 'center' },
    { id: 'SPD tsunami', label: 'SPD Tsunami', align: 'center' },
    { id: 'perlengkapan keselamatan', label: 'Perlengkapan Keselamatan', align: 'center' },
    { id: 'rambu dan jalur evakuasi', label: 'Rambu dan Jalur Evakuasi', align: 'center' },
    { id: 'perawatan', label: 'Perawatan', align: 'center' }
  ];

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
          Keberadaan Fasilitas / Upaya Antisipasi / Mitigasi Bencana Alam di Kecamatan {kecamatan}, {tahun}
        </Typography>

        {sortedData.length > 0 ? (
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
                        fontWeight: 'bold !important',
                        fontSize: '0.7rem !important',
                        padding: '2px 6px !important',
                        lineHeight: 1.2
                      }}
                    >
                      No
                    </TableCell>

                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
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
                        </TableSortLabel>
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
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {formatValue(row['SPD bencana alam'])}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {formatValue(row['SPD tsunami'])}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {formatValue(row['perlengkapan keselamatan'])}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {formatValue(row['rambu dan jalur evakuasi'])}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                        {formatValue(row['perawatan'])}
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

TabelMitigasiBencanaCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string,
  kecamatan: PropTypes.string
};
