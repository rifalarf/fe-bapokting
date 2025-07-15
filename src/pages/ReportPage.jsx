import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DateFilter from '../components/DateFilter';
import SearchBar from '../components/SearchBar';
import {
  Button,
  Table,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Badge,
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ReportPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const [reportData, setReportData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/report/prices`,
        {
          date: selectedDate,
        },
        {
          timeout: 20000,
        }
      );
      setReportData(response.data);
      setErrorMsg('');
    } catch (err) {
      console.error(
        'Error fetching report data:',
        err.response?.data || err.message
      );
      setErrorMsg('Gagal mengambil data laporan, Silahkan Refresh kembali');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    const filterData = () => {
      const lowercasedKeyword = keyword.toLowerCase();
      const filtered = reportData.filter(item =>
        item.commodity_name.toLowerCase().includes(lowercasedKeyword)
      );
      setFilteredReportData(filtered);
    };

    filterData();
  }, [reportData, keyword]);

  const exportExcel = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/report/export-excel`,
        { reportData: filteredReportData },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan-Komoditas-${selectedDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(
        'Error exporting to Excel:',
        err.response?.data || err.message
      );
      alert('Gagal export ke Excel');
    }
  };

  const formatRupiah = (value) => {
    if (value === 0) return 'Rp. 0';
    if (!value || isNaN(value)) return '-';
    return `Rp. ${Number(value).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-3 fw-bold text-primary-custom'>
        Laporan Harian Harga Komoditas Bapokting Terpadu
      </h2>
      <Alert variant='info' className='mb-4 info-box info-box-custom'>
        <p className='fw-bold fs-5 mb-2'>Laporan Harian Bapokting Terpadu</p>
        <ul>
          <li>
            <strong>Akses Laporan </strong>harga bahan pokok dari seluruh pasar
            terbesar di Wilayah Kabupaten Garut untuk hari ini.
          </li>
          <li>
            <strong>Pilih Tanggal : </strong>untuk melihat laporan sebelumnya.
          </li>
          <li>
            <strong>Unduh Laporan : </strong>dalam format Excel dengan mudah !
          </li>
        </ul>
      </Alert>

      <div className='filter-sticky-header mb-4 report-filter-sticky'>
        <Row className='align-items-end g-2'>
          <Col xs={6} md={4}>
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </Col>
          <Col xs={6} md={4}>
            <SearchBar
              keyword={keyword}
              onKeywordChange={setKeyword} label='Cari Komoditas'
            />
          </Col>
          <Col
            xs={6}
            md={4}
            className='text-md-end mt-2 mt-md-0 d-flex align-items-end justify-content-md-end'
          >
            <Button
              onClick={exportExcel}
              disabled={reportData.length === 0}
              className='btn-export-excel'
            >
              Export Excel
            </Button>
          </Col>
        </Row>
      </div>

      {loading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '60vh' }}
        >
          <Spinner animation='border' />
        </div>
      )}
      {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}

      {!loading && reportData.length === 0 && !errorMsg && (
        <Alert variant='info'>
          Data tidak ditemukan untuk tanggal{' '}
          {new Date(selectedDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Alert>
      )}

      {!loading && reportData.length > 0 && (
        <Card className='p-3 mb-4 shadow-sm report-table-card'>
          <div className='table-responsive-wrapper'>
            <Table striped bordered hover className='report-table'>
              <thead>
                <tr>
                  <th>
                    No
                  </th>
                  <th
                    className='sticky-col' 
                  >
                    Komoditas
                  </th>
                  <th
                    className='sticky-col'
                  >
                    Satuan
                  </th>
                  <th>Pasar Guntur</th>
                  <th>Pasar Kadungora</th>
                  <th>Pasar Wanaraja</th>
                  <th>Pasar Pameungpeuk</th>
                  <th>Rata-rata Hari Ini</th>
                  <th>Rata-rata Sebelumnya</th>
                  <th>Selisih</th>
                  <th>Selisih (%)</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportData.map((item, index) => (
                  <tr key={item.commodity_id}>
                    <td>
                      {index + 1}
                    </td>
                    <td className='sticky-col bg-white'>
                      {item.commodity_name}
                    </td>
                    <td className='sticky-col bg-white'>
                      {item.unit}
                    </td>
                    <td>{formatRupiah(item.prices['170'] || '-')}</td>
                    <td>{formatRupiah(item.prices['171'] || '-')}</td>
                    <td>{formatRupiah(item.prices['172'] || '-')}</td>
                    <td>{formatRupiah(item.prices['173'] || '-')}</td>
                    <td className='fw-bold'>
                      {formatRupiah(item.current_price || '-')}
                    </td>
                    <td className='text-muted'>
                      {formatRupiah(item.previous_price || '-')}
                    </td>
                    <td>{formatRupiah(item.difference || 0)}</td>
                    <td>{item.percentage_difference > 0 ? '+' : ''}{item.percentage_difference}%</td>
                    <td className='text-center'> 
                      <Badge 
                        pill 
                        className={`status-badge status-badge-${item.status?.toLowerCase()}`}
                      >
                        {item.status}{' '}
                        {item.status === 'Naik' && (
                          <i className='bi bi-arrow-up-right-circle-fill'></i>
                        )}
                        {item.status === 'Turun' && (
                          <i className='bi bi-arrow-down-right-circle-fill'></i>
                        )}
                        {item.status === 'Tetap' && (
                          <i className='bi bi-arrow-right-circle-fill'></i>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default ReportPage;