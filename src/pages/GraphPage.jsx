import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DateFilter from '../components/DateFilter';
import MarketDropdown from '../components/MarketDropdown';
import CommodityDropdown from '../components/CommodityDropdown';
import {
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Container,
} from 'react-bootstrap';

const GraphPage = () => {
  const [endDate, setEndDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const [selectedMarket, setSelectedMarket] = useState('170');
  const [selectedMarketName, setSelectedMarketName] = useState('Pasar Guntur');
  const [selectedCommodity, setSelectedCommodity] = useState('2');
  const [commodityOptions, setCommodityOptions] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [commodityName, setCommodityName] = useState('');

  // Ambil daftar komoditas saat pertama kali
  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/commodity/list`)
      .then((res) => {
        const formatted = res.data.map((item) => ({
          ...item,
          id: item.id.toString(),
        }));
        setCommodityOptions(formatted);

        const found = formatted.find((c) => c.id === '2');
        if (found) setCommodityName(found.name);
        else if (formatted.length > 0) {
          setSelectedCommodity(formatted[0].id);
          setCommodityName(formatted[0].name);
        }
      })
      .catch(() => setErrorMsg('Gagal memuat daftar komoditas'));
  }, []);

  // Ambil data grafik saat filter berubah
  const fetchGraphData = useCallback(async () => {
    if (!endDate || !selectedCommodity || !selectedMarket) {
      setGraphData([]);
      setErrorMsg('');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Fungsi untuk ambil data berdasarkan tanggal
      const fetchDataForDate = async (date) => {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/graph`,
          {
            market_id: selectedMarket,
            commodity_id: selectedCommodity,
            date,
          },
          {
            timeout: 10000,
          }
        );
        return response.data;
      };

      // ambil data hari ini
      let data = await fetchDataForDate(endDate);

      // Jika kosong, tampilkan data kemarin
      if (!data.prices || data.prices.length === 0) {
        const yesterday = new Date(endDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const formatted = yesterday.toISOString().split('T')[0];

        data = await fetchDataForDate(formatted);

        if (data.prices && data.prices.length > 0) {
          setErrorMsg(
            'Data hari ini tidak tersedia, menampilkan data kemarin.'
          );
        }
      }

      // Jika tetap kosong
      if (!data.prices || data.prices.length === 0) {
        setGraphData([]);
        setErrorMsg(
          'Data grafik tidak tersedia untuk hari ini maupun kemarin.'
        );
        return;
      }

      // data untuk grafik
      const transformedData = data.prices.map((item) => ({
        date: item.date,
        price: item.price,
        market_name: data.market_name,
      }));

      setCommodityName(data.commodity_name);
      setGraphData(transformedData);
      setErrorMsg('');
    } catch (err) {
      console.error(
        'Error fetching graph data:',
        err.response?.data || err.message
      );
      setErrorMsg('Gagal mengambil data grafik, Silahkan refresh kembali');
    } finally {
      setLoading(false);
    }
  }, [endDate, selectedCommodity, selectedMarket]);

  useEffect(() => {
    if (endDate && selectedCommodity && selectedMarket) {
      fetchGraphData();
    }
  }, [endDate, selectedCommodity, selectedMarket, fetchGraphData]);

  const getMarketNameById = (id) => {
    const marketOptions = [
      { value: '170', label: 'Pasar Guntur' },
      { value: '171', label: 'Pasar Kadungora' },
      { value: '172', label: 'Pasar Wanaraja' },
      { value: '173', label: 'Pasar Pameungpeuk' },
    ];
    return (
      marketOptions.find((opt) => opt.value === id)?.label || 'Tidak Diketahui'
    );
  };

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-3 fw-bold text-primary-custom'>
        Grafik Harga Komoditas
      </h2>
      <Alert variant='info' className='mb-4 info-box info-box-custom'>
        <p className='fw-bold fs-5 mb-2'>
          Lihan Trend Perubahan Harga Bapokting Seminggu Terakhir
        </p>
        <ul>
          <li>
            <strong>Pilih Tanggal : </strong> Grafik akan menampilkan data harga
            selama 7 hari terakhir, berakhir pada tanggal yang Anda pilih di
            sini.
          </li>
          <li>
            <strong>Pilih Komoditas : </strong>Ganti komoditas untuk melihat
            tren harga yang berbeda.
          </li>
          <li>
            <strong>Pilih Pasar : </strong>Lihat tren harga di pasar lain untuk
            komoditas ini.
          </li>
        </ul>
      </Alert>

      <div className='filter-sticky-header mb-4'>
        <Form>
          <Row className='g-2'>
            <Col xs={6} md={4}>
              <DateFilter selectedDate={endDate} onDateChange={setEndDate} />
            </Col>
            <Col xs={6} md={4}>
              {commodityOptions.length > 0 ? (
                <CommodityDropdown
                  selectedCommodity={selectedCommodity}
                  onCommodityChange={(value) => {
                    setSelectedCommodity(value);
                    const found = commodityOptions.find((c) => c.id === value);
                    if (found) setCommodityName(found.name);
                  }}
                  options={commodityOptions}
                />
              ) : (
                <Alert variant='warning' className='p-2'>
                  Memuat komoditas...
                </Alert>
              )}
            </Col>
            <Col xs={6} md={4}>
              <MarketDropdown
                selectedMarket={selectedMarket}
                onMarketChange={(value) => {
                  setSelectedMarket(value);
                  setSelectedMarketName(getMarketNameById(value));
                }}
              />
            </Col>
          </Row>
        </Form>
      </div>

      {loading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '400vh' }}
        >
          <Spinner animation='border' />
        </div>
      )}

      {errorMsg && (
        <Alert variant='danger' className='mt-3'>
          {errorMsg}
        </Alert>
      )}

      {!loading && graphData.length > 0 && (
        <Card className='p-3 mb-4 shadow-sm graph-card'>
          <h3 className='text-center mb-3 text-primary-custom'>
            Grafik Harga {commodityName} di {selectedMarketName}
          </h3>
          <ResponsiveContainer width='100%' height={400} className='mt-4'>
            <LineChart
              data={graphData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip
                formatter={(value, props) => {
                  const marketName = props?.payload?.market_name || '';
                  return [
                    `Rp${value.toLocaleString('id-ID')}`,
                    `${commodityName} - ${marketName}`,
                  ];
                }}
                labelFormatter={(label) => `Tanggal: ${label}`}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='price'
                name='Harga'
                stroke={getLineColor(selectedCommodity)}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{
                  stroke: getLineColor(selectedCommodity),
                  strokeWidth: 2,
                  r: 4,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!loading && !errorMsg && graphData.length === 0 && (
        <Alert variant='info' className='mt-3'>
          Data grafik tidak tersedia untuk pilihan Anda.
        </Alert>
      )}
    </Container>
  );
};

const getLineColor = (commodityId) => {
  const colors = ['#006747', '#DA291C', '#FDB813', '#8884d8', '#82ca9d'];
  return colors[parseInt(commodityId) % colors.length];
};

export default GraphPage;
