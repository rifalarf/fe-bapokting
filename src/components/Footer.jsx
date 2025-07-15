import { Container, Row, Col, Nav, NavLink } from 'react-bootstrap';

function Footer() {
  return (
    <footer className='footer'>
      <Container fluid>
        <Row>
          <Col xs={12} md={4} className='mb-4'>
            <h2 className='footer-title'>BAPOKTING Garut</h2>
            <p className='footer-description'>
              BAPOKTING Garut merupakan website yang berguna untuk memudahkan
              masyarakat melihat Informasi Harga Bahan Kebutuhan Pokok dan
              Barang Penting di pasar-pasar yang ada di Kabupaten Garut.
            </p>
          </Col>
          <Col xs={12} md={4} className='mb-4 text-center'>
            <Nav className='flex-column footer-links mx-auto'>
              <h4 className='footer-title'>Tautan Cepat</h4>
              <NavLink href='/' className='fw-bold'>Harga Bapokting</NavLink>
              <NavLink href='/grafik' className='fw-bold'>Grafik</NavLink>
              <NavLink href='/peta' className='fw-bold'>Peta UPT</NavLink>
              <NavLink href='/laporan' className='fw-bold'>Laporan</NavLink>
              <NavLink href='/berita' className='fw-bold'>Berita</NavLink>
              <NavLink href='/tentang' className='fw-bold'>Tentang</NavLink>
            </Nav>
          </Col>
          <Col xs={12} md={4} className='mb-4 text-center'>
            <h4 className='footer-title'>Hubungi Kami</h4>
            <p className='footer-description'>Bidang Perdagangan</p>
            <p className='footer-description'>
              Dinas Perindustrian dan Perdagangan ESDM
            </p>
            <p className='footer-description'>
              Jalan Merdeka No. 219, Jayaraga, Kecamatan Tarogong Kidul, Kabupaten
              Garut 44151
            </p>
            <p className='footer-description'>
              Email: diseprindag,esdm.garut@gmail.com
            </p>
          </Col>
        </Row>
        <div className='custom-line'></div>

        <Row className='text-center py-3'>
          <Col>
            &copy; {new Date().getFullYear()} Bahan Pokok Garut. DISPERINDAG &
            ESDM GARUT
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
