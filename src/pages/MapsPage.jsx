import { useState, useEffect, useCallback } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapsPage = () => {
  const [upts, setUpts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpts();
  }, [fetchUpts]);

  const formatPhoneNumberForWhatsapp = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-4 fw-bold text-primary-custom'>
        Peta Lokasi Unit Pelaksana Teknis (UPT)
      </h2>

      {error && <Alert variant='danger'>{error}</Alert>}

      <Card className='p-3 mb-4 shadow-sm map-card'>
        {loading && <Spinner animation='border' className='d-block mx-auto' />}
        <MapContainer
          center={[-7.21345, 107.89765]}
          zoom={12}
          style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {upts.map((upt) => (
            <Marker key={upt.id} position={[upt.latitude, upt.longitude]}>
              <Popup className='upt-popup-custom'>

                <p>
                  <strong>Nama Pasar:</strong> {upt.namaPasar} - {upt.wilayahPasar}
                </p>
                <p>
                  <strong>Nama UPT:</strong> {upt.namaUpt}
                </p>
                <p>
                  <strong>Kepala UPT:</strong> {upt.kepalaUpt}
                </p>
                <p>
                  <strong>Alamat UPT:</strong> {upt.alamatUpt}
                </p>
                
                {/* Tautan WhatsApp */}
                <p>
                  <strong>Telp:</strong> {upt.noHp}{' '}
                  {upt.noHp && (
                    <a 
                      href={`https://wa.me/${formatPhoneNumberForWhatsapp(upt.noHp)}`} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className='text-success ms-2'
                    >
                      <i className='bi bi-whatsapp'></i> WhatsApp
                    </a>
                  )}
                </p>

                <div className='d-flex justify-content-center mt-2'>
                  <Button 
                    variant='primary' 
                    size='sm' 
                    className='action-btn-custom'
                    href={`https://www.google.com/maps/search/?api=1&query=${upt.latitude},${upt.longitude}`} 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    <i className='bi bi-geo-alt-fill me-1'></i> Lihat di Google Maps
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </Container>
  );
};

export default MapsPage;