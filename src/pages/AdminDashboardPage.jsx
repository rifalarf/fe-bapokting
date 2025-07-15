import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { authState } = useAuth();

  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-4 fw-bold text-primary-custom'>
        Selamat Datang di Dashboard Admin
      </h2>

      {authState.isAuthenticated && authState.username && (
        <p className='text-center text-muted mb-4'>
          Anda login sebagai:{' '}
          <span className='fw-bold text-primary'>{authState.username}</span> (
          {authState.role})
        </p>
      )}

      <Row className='justify-content-center g-4'>
        {/* Card untuk Kelola Peta UPT */}
        <Col xs={12} md={6} lg={4}>
          <Card className='shadow-sm h-100 admin-dashboard-card'>
            <Card.Body className='text-center d-flex flex-column justify-content-between align-items-center'>
              <i className='bi bi-geo-alt-fill text-primary display-4 mb-3'></i>{' '}
              {/* Ikon Peta */}
              <Card.Title className='fw-bold'>Kelola Peta UPT</Card.Title>
              <Card.Text>
                Tambah, edit, dan hapus data lokasi Unit Pelaksana Teknis (UPT)
                yang akan ditampilkan di peta.
              </Card.Text>
              <Button
                as={Link}
                to='/admin/upt-management'
                variant='primary'
                className='mt-auto w-75 btn-primary-custom'
              >
                Buka Manajemen UPT
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card untuk Kelola Berita */}
        <Col xs={12} md={6} lg={4}>
          <Card className='shadow-sm h-100 admin-dashboard-card'>
            <Card.Body className='text-center d-flex flex-column justify-content-between align-items-center'>
              <i className='bi bi-newspaper text-primary display-4 mb-3'></i>{' '}
              {/* Ikon Berita */}
              <Card.Title className='fw-bold'>Kelola Berita</Card.Title>
              <Card.Text>
                Buat, perbarui, dan hapus postingan berita atau pengumuman
                penting.
              </Card.Text>
              <Button
                as={Link}
                to='/admin/news-management'
                variant='primary'
                className='mt-auto w-75 btn-primary-custom'
              >
                Buka Manajemen Berita
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card opsional lainnya (misal: Kelola Pengguna, Pengaturan, dll.) */}
        {/* <Col xs={12} md={6} lg={4}>
          <Card className='shadow-sm h-100 admin-dashboard-card'>
            <Card.Body className='text-center d-flex flex-column justify-content-between align-items-center'>
              <i className='bi bi-person-circle text-secondary display-4 mb-3'></i>
              <Card.Title className='fw-bold'>Manajemen Akun Admin</Card.Title>
              <Card.Text>
                Kelola data akun pengguna admin dan petugas UPT.
              </Card.Text>
              <Button as={Link} to='/admin/users' variant='secondary' className='mt-auto w-75'>
                Buka Manajemen Akun
              </Button>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      <div className='text-center mt-5'>
        <Button as={Link} to='/' variant='outline-secondary'>
          Kembali ke Tampilan Publik
        </Button>
      </div>
    </Container>
  );
};

export default AdminDashboardPage;
