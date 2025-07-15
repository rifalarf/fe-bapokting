import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/Logo_.png';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const HeaderNav = () => {
  const { authState, logout } = useAuth();
  const { triggerToast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    triggerToast('Anda telah berhasil logout.', 'success');
    setTimeout(() => {
      logout();
    }, 500);
  };

  return (
    <Navbar bg='light' expand='lg' sticky='top' className='shadow-sm'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img
            src={logo}
            alt='Logo'
            width='170'
            height='40'
            className='d-inline-block align-top'
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse
          id='basic-navbar-nav'
          className='justify-content-between'
        >
          <Nav className='mx-auto custom-nav-links'>
            <Nav.Link
              as={Link}
              to='/'
              className={location.pathname === '/' ? 'active' : ''}
            >
              Harga Bapokting
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/grafik'
              className={location.pathname === '/grafik' ? 'active' : ''}
            >
              Grafik
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/peta'
              className={location.pathname === '/peta' ? 'active' : ''}
            >
              Peta UPT Pasar
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/laporan'
              className={location.pathname === '/laporan' ? 'active' : ''}
            >
              Laporan
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/berita'
              className={location.pathname === '/berita' ? 'active' : ''}
            >
              Berita
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/tentang'
              className={location.pathname === '/tentang' ? 'active' : ''}
            >
              Tentang
            </Nav.Link>

            {authState.isAuthenticated && authState.role === 'admin' && (
              <>
                <Nav.Link
                  as={Link}
                  to='/admin/upt-management'
                  className={
                    location.pathname === '/admin/upt-management'
                      ? 'active'
                      : ''
                  }
                >
                  Kelola Peta UPT
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to='/admin/news-management'
                  className={
                    location.pathname === '/admin/news-management'
                      ? 'active'
                      : ''
                  }
                >
                  Kelola Berita
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className='custom-auth-links'>
            <Nav.Item className='d-flex align-items-center ms-lg-3'>
              {authState.isAuthenticated ? (
                <>
                  <Navbar.Text className='me-2 d-none d-lg-block'>
                    Halo, {authState.username}! {/* Tampilkan username admin */}
                  </Navbar.Text>
                  <Button
                    variant='outline-danger'
                    onClick={handleLogout}
                    className='btn-logout-custom'
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className='me-2' />{' '}
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant='outline-primary'
                  as={Link}
                  to='/login'
                  className='btn-login-custom'
                >
                  <FontAwesomeIcon icon={faSignInAlt} className='me-2' /> Login
                </Button>
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNav;
