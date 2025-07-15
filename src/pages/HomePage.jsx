import { useEffect, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Container,
  Form,
  Carousel,
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DateFilter from '../components/DateFilter';
import MarketDropdown from '../components/MarketDropdown';
import SearchBar from '../components/SearchBar';
import KetFilter from '../components/KetFilter';
import axios from 'axios';

import screen1 from '../assets/1.jpg';
import screen2 from '../assets/2.jpg';
import screen3 from '../assets/3.jpg';
import screen4 from '../assets/4.jpg';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [selectedMarket, setSelectedMarket] = useState('170');
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!selectedDate || !selectedMarket) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/data`,
        {
          market_id: selectedMarket,
          date: selectedDate,
        }
      );

      const result = response.data;
      const filtered = result.filter((item) => {
        const matchesKeyword = item.commodity_name
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const matchesStatus = selectedStatus
          ? item.status === selectedStatus
          : true;
        return matchesKeyword && matchesStatus;
      });

      setData(filtered);
    } catch (err) {
      console.error('Error fetching data:', err.response?.data || err.message);
      setError('Silahkan Refresh Kembali');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedMarket, keyword, selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Container className='carousel-container-wrapper mt-0 pt-0'>
        <Carousel controls={false} indicators={false} interval={3000}>
          <Carousel.Item>
            <img
              className='d-block w-100 carousel-img'
              src={screen1}
              alt='First slide'
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='d-block w-100 carousel-img'
              src={screen2}
              alt='Second slide'
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='d-block w-100 carousel-img'
              src={screen3}
              alt='Third slide'
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='d-block w-100 carousel-img'
              src={screen4}
              alt='Fourth slide'
            />
          </Carousel.Item>
        </Carousel>
      </Container>

      <Container className='mt-4'>
        <h2 className='text-center mb-3 fw-bold text-primary-custom'>
          Data Harga Komoditas Bapokting
        </h2>
        <Alert variant='info' className='mb-4 info-box info-box-custom'>
          <p className='fw-bold fs-5 mb-2'>
            Akses Data Harga Bapokting Lebih Cepat !
          </p>
          <ul>
            <li>
              <strong>Data Harga Terkini : </strong>Dapatkan update harga bahan
              pokok dan penting setiap hari.
            </li>
            <li>
              <strong>Pilih Tanggal : </strong> Lihat harga komoditas di
              hari-hari sebelumnya.
            </li>
            <li>
              <strong>Pilih Pasar : </strong>Pantau harga spesifik dari pasar
              pilihan Anda di Garut.
            </li>
            <li>
              <strong>Cari Komoditas : </strong>Temukan harga bahan pokok yang
              Anda inginkan dengan mudah.
            </li>
            <li>
              <strong>Status Keterangan : </strong>Ketahui apakah harga Naik,
              Turun, atau Tetap dibandingkan hari sebelumnya.
            </li>
          </ul>
        </Alert>

        <div className='filter-sticky-header'>
          <Form className='mb-2'>
            <Row>
              <Col xs={6} md={3}>
                <DateFilter
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </Col>
              <Col xs={6} md={3}>
                <MarketDropdown
                  selectedMarket={selectedMarket}
                  onMarketChange={setSelectedMarket}
                />
              </Col>
              <Col xs={6} md={3}>
                <SearchBar keyword={keyword} onKeywordChange={setKeyword} label='Cari Komoditas' />
              </Col>
              <Col xs={6} md={3}>
                <KetFilter
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
              </Col>
            </Row>
          </Form>
        </div>

        {loading ? (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ minHeight: '60vh' }}
          >
            <Spinner animation='border' />
          </div>
        ) : error ? (
          <Alert variant='danger'>{error}</Alert>
        ) : data.length === 0 ? (
          <Alert variant='info'>Belum ada data harga komoditas</Alert>
        ) : (
          <Row>
            {data.map((item, index) => (
              <Col
                key={index}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                xl={2}
                className='mb-4 d-flex'
              >
                <Card className='h-100 w-100 commodity-card shadow-sm'>
                  <Card.Img
                    variant='top'
                    src={
                      item.commodity_image_path
                        ? `https://svc-silinda.jabarprov.go.id/assets/public/image/commodities/${item.commodity_image_path}`
                        : 'https://placehold.co/150x150?text=No+Image'
                    }
                    alt={item.commodity_name}
                    className='img-fluid d-block mx-auto card-img-custom'
                  />
                  <Card.Body className='d-flex flex-column justify-content-between'>
                    <Card.Title className='text-center fw-bold commodity-title'>
                      {item.commodity_name}
                    </Card.Title>
                    <Card.Text className='text-justify commodity-price-info'>
                      Harga Saat Ini:{' '}
                      <strong className='text-primary'>
                        Rp. {item.current_price?.toLocaleString('id-ID')}
                      </strong>
                      <br />
                      Harga Kemarin :{' '}
                      <small>
                        Rp. {item.previous_price?.toLocaleString('id-ID')}
                      </small>
                      <br />
                      Keterangan:{' '}
                      <strong
                        className={`status-text status-${item.status?.toLowerCase()}`}
                      >
                        {' '}
                        {/* Tambah kelas status */}
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
                      </strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomePage;