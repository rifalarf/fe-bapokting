import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Modal,
} from 'react-bootstrap';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SearchBar from '../components/SearchBar';

// Icon kustom untuk marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const UptManagementPage = () => {
  const { authState } = useAuth();
  const { triggerToast } = useToast();

  const [upts, setUpts] = useState([]);
  const [filteredUpts, setFilteredUpts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUpt, setCurrentUpt] = useState({
    id: null,
    namaPasar: '',
    wilayahPasar: '',
    namaUpt: '',
    kepalaUpt: '',
    alamatUpt: '',
    noHp: '',
    latitude: '',
    longitude: '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uptToDeleteId, setUptToDeleteId] = useState(null);

  const [keyword, setKeyword] = useState(''); 
  const fetchUpts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/upt`);
      setUpts(response.data);
    } catch (err) {
      console.error('Error fetching UPTs:', err.response?.data || err.message);
      setError('Gagal mengambil data UPT.');
      setUpts([]);
      triggerToast('Gagal memuat data UPT.', 'danger');
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    fetchUpts();
  }, [fetchUpts]);

  useEffect(() => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = upts.filter(
      (upt) =>
        (upt.namaPasar && upt.namaPasar.toLowerCase().includes(lowercasedKeyword)) ||
        (upt.wilayahPasar && upt.wilayahPasar.toLowerCase().includes(lowercasedKeyword)) ||
        (upt.namaUpt && upt.namaUpt.toLowerCase().includes(lowercasedKeyword)) ||
        (upt.kepalaUpt && upt.kepalaUpt.toLowerCase().includes(lowercasedKeyword)) ||
        (upt.alamatUpt && upt.alamatUpt.toLowerCase().includes(lowercasedKeyword)) ||
        (upt.noHp && upt.noHp.toLowerCase().includes(lowercasedKeyword))
    );
    setFilteredUpts(filtered);
  }, [upts, keyword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUpt((prev) => ({ ...prev, [name]: value }));
  };

  const MapClickHandler = () => {
    // eslint-disable-next-line no-unused-vars
    const map = useMapEvents({
      click: (e) => {
        if (!isEditing) {
          setCurrentUpt((prev) => ({
            ...prev,
            latitude: e.latlng.lat.toFixed(6),
            longitude: e.latlng.lng.toFixed(6),
          }));
          setShowModal(true);
        }
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (
      !currentUpt.namaPasar ||
      !currentUpt.wilayahPasar ||
      !currentUpt.namaUpt ||
      !currentUpt.alamatUpt ||
      !currentUpt.latitude ||
      !currentUpt.longitude
    ) {
      triggerToast(
        'Nama Pasar, Wilayah Pasar, Nama UPT, Alamat, dan Koordinat wajib diisi!',
        'danger'
      );
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/upt/${currentUpt.id}`,
          currentUpt,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authState.token}` } }
        );
        triggerToast('UPT berhasil diperbarui!', 'success');
      } else {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/upt`,
          currentUpt,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authState.token}` } }
        );
        triggerToast('UPT berhasil ditambahkan!', 'success');
      }

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        fetchUpts();
      }, 500);

    } catch (err) {
      console.error('Error submitting UPT:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Gagal menyimpan UPT.');
      triggerToast(
        err.response?.data?.message || 'Gagal menyimpan UPT.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (upt) => {
    setCurrentUpt({
      id: upt.id,
      namaPasar: upt.namaPasar,
      wilayahPasar: upt.wilayahPasar,
      namaUpt: upt.namaUpt,
      kepalaUpt: upt.kepalaUpt,
      alamatUpt: upt.alamatUpt,
      noHp: upt.noHp,
      latitude: upt.latitude,
      longitude: upt.longitude,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setUptToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!uptToDeleteId) return;

    setLoading(true);
    setError('');
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/upt/${uptToDeleteId}`,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      triggerToast('UPT berhasil dihapus!', 'success');

      setTimeout(() => {
        setShowConfirmModal(false);
        setUptToDeleteId(null);
        fetchUpts();
      }, 500);

    } catch (err) {
      console.error('Error deleting UPT:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Gagal menghapus UPT.');
      triggerToast(
        err.response?.data?.message || 'Gagal menghapus UPT.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentUpt({
      id: null,
      namaPasar: '',
      wilayahPasar: '',
      namaUpt: '',
      kepalaUpt: '',
      alamatUpt: '',
      noHp: '',
      latitude: '',
      longitude: '',
    });
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setUptToDeleteId(null);
  };

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-4 fw-bold text-primary-custom'>
        Manajemen Lokasi UPT
      </h2>

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
          <i className='bi bi-plus-circle me-2'></i> Tambah UPT Baru
        </Button>
      </div>

      <Card className='p-3 mb-4 shadow-sm map-card'>
        <h3 className='text-center mb-3 text-primary-custom'>
          Peta Lokasi UPT
        </h3>
        {loading && <Spinner animation='border' className='d-block mx-auto' />}
        <MapContainer
          center={[-7.21345, 107.89765]}
          zoom={12}
          style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
          whenCreated={() => {}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />

          {upts.map((upt) => (
            <Marker
              key={upt.id}
              position={[upt.latitude, upt.longitude]}
            >
              <Popup className='upt-popup-custom'>
                <strong>{upt.namaUpt}</strong>
                <br />
                {upt.namaPasar} - {upt.wilayahPasar}
                <br />
                {upt.alamatUpt}
                <br />
                Telp: {upt.noHp}
                <br />
                <div className='d-flex justify-content-between mt-2'>
                  <Button
                    variant='info'
                    size='sm'
                    className='me-2 action-btn-custom'
                    onClick={() => handleEdit(upt)}
                  >
                    <i className='bi bi-pencil-square me-1'></i> Edit
                  </Button>
                  <Button
                    variant='danger'
                    size='sm'
                    className='action-btn-custom'
                    onClick={() => handleDeleteClick(upt.id)}
                  >
                    <i className='bi bi-trash-fill me-1'></i> Hapus
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>

      <h3 className='mb-3 text-primary-custom'>Daftar UPT</h3>
      <div className='mb-3'>
        {' '}
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} label='Cari Nama Pasar' />{' '}
      </div>

      {loading && filteredUpts.length === 0 ? ( 
        <div className='text-center'>
          <Spinner animation='border' /> Memuat daftar UPT...
        </div>
      ) : filteredUpts.length === 0 && !error ? ( 
        <Alert variant='info'>
          Belum ada data UPT. Klik peta atau tombol &quot;Tambah UPT Baru&quot; untuk
          menambahkan.
          {keyword && ` dengan pencarian '${keyword}'`}
        </Alert>
      ) : (
        <div className='table-responsive-wrapper upt-table-responsive-wrapper'>
          <Table striped bordered hover className='upt-table shadow-sm'>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pasar</th>
                <th>Wilayah Pasar</th>
                <th>Nama UPT</th>
                <th>Kepala UPT</th>
                <th>No HP</th>
                <th>Alamat</th>
                <th>Koordinat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              
              {filteredUpts.map((upt, index) => (
                <tr key={upt.id}>
                  <td>{index + 1}</td>
                  <td>{upt.namaPasar}</td>
                  <td>{upt.wilayahPasar}</td>
                  <td>{upt.namaUpt}</td>
                  <td>{upt.kepalaUpt}</td>
                  <td>{upt.noHp}</td>
                  <td>{upt.alamatUpt}</td>
                  <td>
                    {upt.latitude}, {upt.longitude}
                  </td>
                  <td>
                    <Button
                      variant='info'
                      size='sm'
                      className='me-2 action-btn-custom'
                      onClick={() => handleEdit(upt)}
                    >
                      <i className='bi bi-pencil-square me-1'></i> Edit
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      className='action-btn-custom'
                      onClick={() => handleDeleteClick(upt.id)}
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
          <Modal.Title>
            {isEditing ? 'Edit Data UPT' : 'Tambah UPT Baru'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Nama Pasar</Form.Label>
              <Form.Control
                type='text'
                name='namaPasar'
                value={currentUpt.namaPasar}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Wilayah Pasar</Form.Label>
              <Form.Control
                type='text'
                name='wilayahPasar'
                value={currentUpt.wilayahPasar}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Nama UPT</Form.Label>
              <Form.Control
                type='text'
                name='namaUpt'
                value={currentUpt.namaUpt}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Kepala UPT</Form.Label>
              <Form.Control
                type='text'
                name='kepalaUpt'
                value={currentUpt.kepalaUpt}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Alamat UPT</Form.Label>
              <Form.Control
                type='text'
                name='alamatUpt'
                value={currentUpt.alamatUpt}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>No HP</Form.Label>
              <Form.Control
                type='text'
                name='noHp'
                value={currentUpt.noHp}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type='number'
                    name='latitude'
                    value={currentUpt.latitude}
                    onChange={handleInputChange}
                    step='0.000001'
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type='number'
                    name='longitude'
                    value={currentUpt.longitude}
                    onChange={handleInputChange}
                    step='0.000001'
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
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
        {' '}
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>{' '}
        </Modal.Header>{' '}
        <Modal.Body>
          Apakah Anda yakin ingin menghapus lokasi UPT ini? Aksi ini tidak dapat
          dibatalkan.{' '}
        </Modal.Body>{' '}
        <Modal.Footer>
          {' '}
          <Button variant='secondary' onClick={handleCloseConfirmModal}>
            Tidak{' '}
          </Button>{' '}
          <Button variant='danger' onClick={confirmDelete} disabled={loading}>
            {' '}
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
            )}{' '}
          </Button>{' '}
        </Modal.Footer>{' '}
      </Modal>{' '}
    </Container>
  );
};

export default UptManagementPage;