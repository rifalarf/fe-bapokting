import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Image,
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

const NewsManagementPage = () => {
  const { authState } = useAuth();
  const { triggerToast } = useToast();

  const [newsList, setNewsList] = useState([]);
  const [filteredNewsList, setFilteredNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    id: null,
    title: '',
    content: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState(null);

  const [keyword, setKeyword] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`);
      setNewsList(response.data);
    } catch (err) {
      console.error('Error fetching news:', err.response?.data || err.message);
      setError('Gagal mengambil data berita.');
      setNewsList([]);
      triggerToast('Gagal memuat data berita.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = newsList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(lowercasedKeyword)) ||
        (item.content &&
          item.content.toLowerCase().includes(lowercasedKeyword)) ||
        (item.Admin?.username &&
          item.Admin.username.toLowerCase().includes(lowercasedKeyword))
    );
    setFilteredNewsList(filtered);
  }, [newsList, keyword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!currentNews.title || !currentNews.content) {
      triggerToast('Judul dan Konten berita wajib diisi!', 'danger');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', currentNews.title);
    formData.append('content', currentNews.content);

    if (imageFile) {
      formData.append('newsImage', imageFile);
    } 

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/news/${currentNews.id}`,
          formData,
          config
        );
        triggerToast('Berita berhasil diperbarui!', 'success');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/news`,
          formData,
          config
        );
        triggerToast('Berita berhasil ditambahkan!', 'success');
      }

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        fetchNews();
      }, 500);
    } catch (err) {
      console.error(
        'Error submitting news:',
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || 'Gagal menyimpan berita.');
      triggerToast(
        err.response?.data?.message || 'Gagal menyimpan berita.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news) => {
    setCurrentNews({
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl || '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setNewsToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!newsToDeleteId) return;

    setLoading(true);
    setError('');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/news/${newsToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      triggerToast('Berita berhasil dihapus!', 'success');

      setTimeout(() => {
        setShowConfirmModal(false);
        setNewsToDeleteId(null);
        fetchNews();
      }, 500);
    } catch (err) {
      console.error('Error deleting news:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Gagal menghapus berita.');
      triggerToast(
        err.response?.data?.message || 'Gagal menghapus berita.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentNews({
      id: null,
      title: '',
      content: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setNewsToDeleteId(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-4 fw-bold text-primary-custom'>Manajemen Berita</h2>

      {error && <Alert variant='danger'>{error}</Alert>}

      <div className='d-flex justify-content-end mb-3'>
        <Button
          variant='primary'
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className='btn-primary-custom'
        >
          <i className='bi bi-plus-circle me-2'></i> Tambah Berita Baru
        </Button>
      </div>

      <h3 className='mb-3 text-primary-custom'>Daftar Berita</h3>
      <div className='mb-3'>
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} label='Cari Judul Berita' />
      </div>

      {loading && filteredNewsList.length === 0 ? (
        <div className='text-center'>
          <Spinner animation='border' /> Memuat daftar berita...
        </div>
      ) : filteredNewsList.length === 0 && !error ? (
        <Alert variant='info'>
          Belum ada berita. Klik tombol &quot;Tambah Berita Baru&quot; untuk menambahkan.
          {keyword && ` dengan pencarian '${keyword}'`}
        </Alert>
      ) : (
        <div className='table-responsive-wrapper news-table-responsive-wrapper'>
          <Table striped bordered hover className='news-table shadow-sm'>
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Berita</th>
                <th>Konten</th>
                <th>Gambar</th>
                <th>Tanggal Posting</th>
                <th>Admin</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsList.map((news, index) => (
                <tr key={news.id}>
                  <td>{index + 1}</td>
                  <td>{news.title}</td>
                  <td>{news.content.substring(0, 100)}...</td>
                  <td>
                    {news.imageUrl ? (
                      <Image
                        src={news.imageUrl}
                        alt='News Image'
                        style={{ width: '80px', height: 'auto', objectFit: 'cover' }}
                        thumbnail
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{formatDate(news.createdAt)}</td>
                  <td>{news.Admin?.username || 'N/A'}</td>
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      className='me-2 action-btn-custom'
                      as={Link}
                      to={`/berita/${news.id}`}
                    >
                      <i className='bi bi-eye-fill me-1'></i> Detail
                    </Button>
                    <Button
                      variant='info'
                      size='sm'
                      className='me-2 action-btn-custom'
                      onClick={() => handleEdit(news)}
                    >
                      <i className='bi bi-pencil-square me-1'></i> Edit
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      className='action-btn-custom'
                      onClick={() => handleDeleteClick(news.id)}
                    >
                      <i className='bi bi-trash-fill me-1'></i> Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Judul Berita</Form.Label>
              <Form.Control
                type='text'
                name='title'
                value={currentNews.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Konten Berita</Form.Label>
              <Form.Control
                as='textarea'
                rows={10}
                name='content'
                value={currentNews.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Gambar Berita</Form.Label>
              <Form.Control
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className='mt-2'>
                  <p>Preview Gambar Baru:</p>
                  <Image src={imagePreview} alt='Preview' fluid thumbnail style={{ maxWidth: '200px' }} />
                </div>
              )}
              {isEditing && currentNews.imageUrl && !imageFile && (
                <div className='mt-2'>
                  <p>Gambar Saat Ini:</p>
                  <Image
                    src={currentNews.imageUrl}
                    alt='Current News Image'
                    fluid
                    thumbnail
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
            <div className='d-flex justify-content-end mt-3'>
              <Button
                variant='secondary'
                onClick={handleCloseModal}
                className='me-2'
              >
                Batal
              </Button>
              <Button variant='primary' type='submit' disabled={loading}>
                {loading ? (
                  <Spinner
                    as='span'
                    animation='border'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                  />
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus berita ini? Aksi ini tidak dapat dibatalkan.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseConfirmModal}>
            Tidak
          </Button>
          <Button variant='danger' onClick={confirmDelete} disabled={loading}>
            {loading ? (
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
              />
            ) : (
              'Ya, Hapus'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsManagementPage;