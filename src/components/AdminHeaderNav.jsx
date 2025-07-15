import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/Logo_.png';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminHeaderNav = () => {
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
    <Navbar
      bg='light'
      expand='lg'
      sticky='top'
      className='shadow-sm custom-navbar'
    >
      <Container>
        <Navbar.Brand as={Link} to='/admin/dashboard'>
          {' '}
          <img
            src={logo}
            alt='Logo Admin'
            width='170'
            height='40'
            className='d-inline-block align-top'
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='admin-navbar-nav' />

        <Navbar.Collapse id='admin-navbar-nav' className='justify-content-end'>
          {' '}
          <Nav className='ms-auto'>
            {' '}
            <Nav.Link
              as={Link}
              to='/admin/dashboard'
              className={
                location.pathname === '/admin/dashboard' ? 'active' : ''
              }
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/admin/upt-management'
              className={
                location.pathname === '/admin/upt-management' ? 'active' : ''
              }
            >
              Kelola Peta UPT
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/admin/news-management'
              className={
                location.pathname === '/admin/news-management' ? 'active' : ''
              }
            >
              Kelola Berita
            </Nav.Link>
            
            <Nav.Item className='d-flex align-items-center ms-lg-3'>
              {authState.isAuthenticated && authState.username && (
                <>
                  <Navbar.Text className='me-2 d-none d-lg-block text-body-color'>
                    Halo, <span className='fw-bold'>{authState.username}</span>!
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
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminHeaderNav;
