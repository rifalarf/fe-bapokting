import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_IMAGE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`);
      setNewsList(response.data);
    } catch (err) {
      console.error(
        'Error fetching news for public page:',
        err.response?.data || err.message
      );
      setError('Gagal memuat berita.');
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi Helper untuk mendapatkan URL gambar lengkap
  const getFullImageUrl = (relativePath) => {
    let baseUrl = BASE_IMAGE_URL;
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }
    return `${baseUrl}${relativePath}`;
  };

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-4 fw-bold text-primary-custom'>
        Berita & Pengumuman Terbaru
      </h2>

      {loading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '60vh' }}
        >
          <Spinner animation='border' />
        </div>
      )}
      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && newsList.length === 0 && !error ? (
        <Alert variant='info' className='text-center'>
          Belum ada berita yang tersedia.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className='g-4'>
          {newsList.map((newsItem) => (
            <Col key={newsItem.id}>
              <Card className='news-card shadow-sm h-100'>
                {newsItem.imageUrl && (
                  <div className='news-card-img-wrapper'>
                    <Card.Img
                      variant='top'
                      src={getFullImageUrl(newsItem.imageUrl)} 
                      alt={newsItem.title}
                      className='news-card-img'
                    />
                  </div>
                )}
                <Card.Body className='d-flex flex-column'>
                  <Card.Title className='news-card-title'>
                    {newsItem.title}
                  </Card.Title>
                  <Card.Text className='news-card-summary text-muted'>
                    {newsItem.content.substring(0, 150)}...
                  </Card.Text>
                  <div className='mt-auto d-flex justify-content-between align-items-center news-card-footer'>
                    <small className='text-muted'>
                      Diposting: {formatDate(newsItem.createdAt)} oleh{' '}
                      {newsItem.Admin?.username || 'Admin'}
                    </small>
                    <Button
                      as={Link}
                      to={`/berita/${newsItem.id}`}
                      variant='primary'
                      size='sm'
                      className='btn-primary-custom'
                    >
                      Baca Selengkapnya
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default NewsPage;