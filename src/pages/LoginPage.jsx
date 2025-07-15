import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { triggerToast } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      login(response.data);
      triggerToast('Login berhasil!', 'success');

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Login gagal:', err.response ? err.response.data : err.message);
      const msg = err.response && err.response.data.message ? err.response.data.message : 'Login gagal. Username dan Password Salah';
      setError(msg);
      triggerToast(msg, 'danger');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="p-4 shadow-custom" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
        <Card.Body>
          <h2 className="text-center mb-4 text-primary-custom">Login Admin</h2>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 btn-primary-custom">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;