// src/ui-component/cards/statistik/ TabelProduksiPerkebunanCard.jsx
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

export default function TabelProduksiPerkebunanCard({ isLoading, data, tahun }) {
  const [tableData, setTableData] = useState([]);
  const [sumber, setSumber] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('kecamatan');
  const [jenisTanamanList, setJenisTanamanList] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      setTableData([]);
      setSumber('');
      return;
    }

    // filter kategori: "Produksi (ton)" dan tahun
    let filtered = data.filter(
      (item) => String(item.kategori).toLowerCase().trim() === 'produksi (ton)' && String(item.tahun) === String(tahun)
    );

    // ambil daftar jenis tanaman unik
    const jenisSet = new Set(filtered.map((item) => String(item['jenis tanaman']).trim()));
    const jenisList = Array.from(jenisSet);
    setJenisTanamanList(jenisList);

    // transform data jadi per kecamatan
    const grouped = {};
    filtered.forEach((item) => {
      const kec = String(item.kecamatan).trim();
      if (!grouped[kec]) grouped[kec] = { kecamatan: kec };

      const tanaman = String(item['jenis tanaman']).trim();
      let val = item.nilai ?? 0;
      if (typeof val === 'string') val = val.replace(',', '.').trim();
      const num = parseFloat(val);
      grouped[kec][tanaman] = (grouped[kec][tanaman] || 0) + (isNaN(num) ? 0 : num);
    });

    const result = Object.values(grouped).map((row) => {
      const total = jenisList.reduce((sum, j) => sum + (row[j] || 0), 0);
      return { ...row, jumlah: total };
    });

    setTableData(result);

    // ambil sumber (pertama yang ketemu)
    const sumberValues = [...new Set(filtered.map((item) => item.sumber))];
    setSumber(sumberValues.length > 0 ? sumberValues[0] : '');
  }, [data, tahun]);

  const formatValue = (val) => {
    if (!val || val === 0) return '-';
    return val.toLocaleString('id-ID');
  };

  // comparator
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
          Nilai Produksi (ton) Perkebunan menurut Jenis Tanaman di Kabupaten/Kota, {tahun}
        </Typography>

        {sortedData.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 500,
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
                    <TableCell
                      key="kecamatan"
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
                        onClick={() => handleRequestSort('kecamatan')}
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

                    {jenisTanamanList.map((j) => (
                      <TableCell
                        key={j}
                        align="center"
                        sortDirection={orderBy === j ? order : false}
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
                          active={orderBy === j}
                          direction={orderBy === j ? order : 'asc'}
                          onClick={() => handleRequestSort(j)}
                          sx={{
                            color: 'inherit !important',
                            '&:hover': { color: 'inherit !important' },
                            '& .MuiTableSortLabel-icon': {
                              color: 'inherit !important'
                            }
                          }}
                        >
                          {j}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                    <TableCell
                      key="jumlah"
                      align="center"
                      sortDirection={orderBy === 'jumlah' ? order : false}
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
                        active={orderBy === 'jumlah'}
                        direction={orderBy === 'jumlah' ? order : 'asc'}
                        onClick={() => handleRequestSort('jumlah')}
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

                      {jenisTanamanList.map((j) => (
                        <TableCell key={j} align="center" sx={{ fontSize: '0.75rem' }}>
                          {formatValue(row[j] || 0)}
                        </TableCell>
                      ))}

                      <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {formatValue(row.jumlah)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Baris total per kolom */}
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.grey[300],
                      fontWeight: 'bold'
                    }}
                  >
                    <TableCell align="center" colSpan={2} sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    {jenisTanamanList.map((j) => {
                      const totalPerTanaman = sortedData.reduce((sum, row) => sum + (row[j] || 0), 0);
                      return (
                        <TableCell key={j} align="center" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {formatValue(totalPerTanaman)}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {formatValue(sortedData.reduce((sum, row) => sum + (row.jumlah || 0), 0))}
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

TabelProduksiPerkebunanCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  tahun: PropTypes.string
};
