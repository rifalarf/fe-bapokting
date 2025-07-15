import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HeaderNav from './components/HeaderNav';
import AdminHeaderNav from './components/AdminHeaderNav';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import MapsPage from './pages/MapsPage';
import GraphPage from './pages/GraphPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import { Toast, ToastContainer } from 'react-bootstrap';

import { AuthContext } from './context/AuthContext';
import { ToastContext } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';

import AdminDashboardPage from './pages/AdminDashboardPage';
import UptManagementPage from './pages/UptManagementPage';
import NewsManagementPage from './pages/NewsManagementPage';

function App() {
  const [authState, setAuthState] = useState(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo
      ? JSON.parse(adminInfo)
      : {
        token: null,
        isAuthenticated: false,
        role: null,
        username: null,
      };
  });

  const [showGlobalToast, setShowGlobalToast] = useState(false);
  const [globalToastMessage, setGlobalToastMessage] = useState('');
  const [globalToastVariant, setGlobalToastVariant] = useState('success');

  const navigate = useNavigate();

  const login = (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setAuthState({
      token: data.token,
      isAuthenticated: true,
      role: data.role,
      username: data.username,
    });
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAuthState({
      token: null,
      isAuthenticated: false,
      role: null,
      username: null,
    });
    navigate('/login');
  };

  const triggerToast = (message, variant = 'success') => {
    setGlobalToastMessage(message);
    setGlobalToastVariant(variant);
    setShowGlobalToast(true);
  };

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      <ToastContext.Provider value={{ triggerToast }}>
        {authState.isAuthenticated && authState.role === 'admin' ? (
          <AdminHeaderNav />
        ) : (
          <HeaderNav />
        )}
        <div>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/grafik' element={<GraphPage />} />
            <Route path='/peta' element={<MapsPage />} />
            <Route path='/laporan' element={<ReportPage />} />
            <Route path='/berita' element={<NewsPage />} />
            <Route path='/berita/:id' element={<NewsDetailPage />} />
            <Route path='/tentang' element={<AboutPage />} />
            <Route path='/login' element={<LoginPage />} />

            <Route
              path='/admin/dashboard'
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin/upt-management'
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <UptManagementPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin/news-management'
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <NewsManagementPage />
                </PrivateRoute>
              }
            />

            <Route
              path='*'
              element={
                authState.isAuthenticated ? (
                  <Navigate to='/admin/dashboard' replace />
                ) : (
                  <Navigate to='/' replace />
                )
              }
            />
          </Routes>
        </div>

        <Footer />

        <ToastContainer
          position='top-end'
          className='p-3'
          style={{ zIndex: 1100 }}
        >
          <Toast
            onClose={() => setShowGlobalToast(false)}
            show={showGlobalToast}
            delay={3000}
            autohide
            bg={globalToastVariant}
          >
            <Toast.Header>
              <strong className='me-auto'>
                {globalToastVariant === 'success' ? 'Sukses!' : 'Gagal!'}
              </strong>
              <small className='text-muted'>baru saja</small>
            </Toast.Header>
            <Toast.Body
              className={
                globalToastVariant === 'success' ? 'text-white' : 'text-white'
              }
            >
              {globalToastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
