import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { authState } = useAuth();

  const fetchNewsDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/news/${id}`
      );
      setNewsItem(response.data);
    } catch (err) {
      console.error(
        'Error fetching news detail:',
        err.response?.data || err.message
      );
      setError('Berita tidak ditemukan atau terjadi kesalahan.');
      setNewsItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsDetail();
  }, [fetchNewsDetail]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getFullImageUrl = (relativePath) => {
    const baseUrlForStaticFiles = import.meta.env.VITE_API_URL.replace(
      '/api',
      ''
    );
    let baseUrl = baseUrlForStaticFiles;
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }
    return `${baseUrl}${relativePath}`;
  };

  const backUrl =
    authState.isAuthenticated && authState.role === 'admin'
      ? '/admin/news-management'
      : '/berita';

  return (
    <Container className='mt-4'>
      {loading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '60vh' }}
        >
          <Spinner animation='border' />
        </div>
      )}
      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && newsItem && (
        <Card className='news-detail-card shadow-sm mb-4'>
          {newsItem.imageUrl && (
            <div className='news-detail-img-wrapper'>
              <Card.Img
                variant='top'
                src={getFullImageUrl(newsItem.imageUrl)}
                alt={newsItem.title}
                className='news-detail-img'
              />
            </div>
          )}
          <Card.Body>
            <Card.Title className='news-detail-title'>
              {newsItem.title}
            </Card.Title>
            <Card.Subtitle className='mb-3 text-muted'>
              Diposting: {formatDate(newsItem.createdAt)} oleh{' '}
              {newsItem.Admin?.username || 'Admin'}
            </Card.Subtitle>
            <Card.Text className='news-detail-content'>
              {newsItem.content.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < newsItem.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </Card.Text>
            <Button
              as={Link}
              to={backUrl}
              variant='outline-primary'
              className='mt-3'
            >
              <i className='bi bi-arrow-left-circle me-2'></i> Kembali ke Daftar
              Berita
            </Button>
          </Card.Body>
        </Card>
      )}

      {!loading && !newsItem && !error && (
        <Alert variant='info' className='text-center'>
          Berita yang Anda cari tidak ditemukan.
        </Alert>
      )}
    </Container>
  );
};

export default NewsDetailPage;
