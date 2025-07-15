import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className='mt-4'>
      <h2 className='text-center mb-5 fw-bold text-primary-custom'>Tentang Website Kami</h2>

      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-sm about-card">
            <Card.Body>
              <h3 className="about-section-title mb-3">Website Informasi Harga Bahan Kebutuhan Pokok dan Barang Penting</h3>
              <p className="text-justify mb-4">
                Website &apos;Bapokting Garut&apos; adalah sebuah platform digital yang dirancang untuk menyediakan informasi komprehensif mengenai harga barang kebutuhan pokok dan barang penting (Bapokting) di Kabupaten Garut secara akurat dan terkini. Tujuan utama pengembangan website ini adalah untuk memfasilitasi akses informasi harga bagi masyarakat umum, pemerintah daerah, dan pihak-pihak terkait lainnya, sehingga dapat mendukung pengambilan keputusan yang lebih informatif dalam kegiatan ekonomi dan perencanaan daerah.
              </p>
              <p className="text-justify">
                Fitur-fitur yang tersedia mencakup tampilan harga real-time, grafik pergerakan harga historis, laporan harga yang dapat diunduh, peta lokasi UPT (Unit Pelaksana Teknis) pasar interaktif, serta berita-berita terkini seputar Bapokting. Website ini berperan sebagai sumber data yang terpusat dan mudah diakses, meningkatkan transparansi pasar dan membantu menjaga stabilitas ekonomi lokal.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-sm about-card">
            <Card.Body>
              <h3 className="about-section-title mb-3">Latar Belakang: Pentingnya Data Harga Bahan Pokok</h3>
              <p className="text-justify mb-4">
               Website Informasi Harga Bahan Pokok dan Kebutuhan Penting (Bapokting) Garut ini dikembangkan dengan berlandaskan pada kerangka regulasi nasional, seperti Undang-Undang Nomor 7 Tahun 2014 tentang Perdagangan dan Peraturan Presiden Nomor 71 Tahun 2015 mengenai Penetapan dan Penyimpanan Barang Kebutuhan Pokok dan Barang Penting. Regulasi ini memberikan mandat kepada Kementerian Perdagangan (Kemendag), bersama pemerintah daerah, untuk menjaga stabilitas harga dan memastikan ketersediaan Bapokting di masyarakat.
              </p>
              <p className="text-justify mb-4">
                Upaya ini merupakan langkah krusial dalam mendukung pengendalian inflasi, khususnya inflasi pangan, mengingat kontribusi signifikan harga bapokting terhadap pengeluaran rumah tangga dan dampaknya terhadap daya beli serta tingkat kemiskinan. Dalam konteks tersebut, perumusan kebijakan yang efektif memerlukan basis data yang akurat, kontinyu, dan menyeluruh.
              </p>
              <p className="text-justify">
                Website ini hadir sebagai solusi konkret untuk memenuhi kebutuhan akan data tersebut secara spesifik di wilayah Kabupaten Garut. Dengan menyediakan informasi harga bapokting secara real-time, website ini berfungsi sebagai sistem peringatan dini (early warning) untuk komoditas yang harganya bergejolak, mendukung pemetaan wilayah sasaran kebijakan, dan membantu pengukuran lingkup kebijakan yang diperlukan oleh pemerintah daerah. Pada akhirnya, platform ini diharapkan dapat menjadi alat bantu strategis bagi masyarakat, pedagang, dan pihak terkait lainnya dalam memantau kondisi pasar dan membuat keputusan yang lebih baik demi stabilitas ekonomi daerah.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-sm about-card">
            <Card.Body>
              <h3 className="about-section-title mb-3">Selayang Pandang Disperindag ESDM</h3>
              <p className="text-justify mb-4">
                Website Informasi Harga Bahan Pokok Penting (Bapokting) Garut ini tidak terlepas dari peran penting Dinas Perindustrian, Perdagangan, Energi dan Sumber Daya Mineral (Disperindag ESDM) Kabupaten Garut.Dinas ini memiliki sejarah panjang dalam mengelola sektor industri dan perdagangan di Garut.
              </p>
              <p className="text-justify mb-4">
              Secara khusus, Bidang Perdagangan di bawah Disperindag ESDM memegang peranan krusial sebagai penggerak utama pembangunan ekonomi daerah. Peran mereka sangat vital dalam menjaga kesejahteraan masyarakat, salah satunya melalui ketersediaan dan stabilitas harga barang kebutuhan pokok.Disperindag ESDM Kabupaten Garut memiliki misi untuk meningkatkan kemandirian ekonomi masyarakat yang berbasis potensi lokal dan berdaya saing. ini sejalan dengan visi Kabupaten Garut untuk mewujudkan masyarakat yang MAJU dan SEJAHTERA, yang diindikasikan dengan kemampuan masyarakat membangun ekonomi tangguh dan pertumbuhan bernilai tinggi, serta menjadi masyarakat yang sehat, cerdas, dan produktif.
              </p>
              <p className="text-justify mb-4">
              Salah satu tugas pokok Bidang Perdagangan adalah melaksanakan pemantauan, monitoring, serta pengumpulan dan pelaporan mengenai harga barang kebutuhan pokok masyarakat di Kabupaten Garut. Tujuannya adalah untuk memberikan informasi yang transparan mengenai perkembangan harga-harga kebutuhan pokok masyarakat, sekaligus meningkatkan indeks kepuasan masyarakat terhadap layanan informasi ini. Disperindag ESDM juga berupaya membangun sistem dan jaringan informasi perdagangan di pasar-pasar tradisional dan menyediakan papan informasi digital di beberapa kecamatan. Laporan monitoring harga ini dibuat secara rutin dan disampaikan kepada pimpinan daerah serta instansi terkait.
              </p>
              <p className="text-justify">
                Dengan demikian, website ini merupakan salah satu wujud nyata komitmen Disperindag ESDM Kabupaten Garut dalam menyediakan informasi harga Bapokting yang akurat dan up-to-date, demi mendukung kemandirian ekonomi dan kesejahteraan masyarakat Garut.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-sm about-card">
            <Card.Body className="text-center">
              <h3 className="about-section-title mb-3">Hubungi Kami</h3>
              <p className="text-muted mb-2">
                Untuk pertanyaan, masukan, atau informasi lebih lanjut mengenai website ini, Anda dapat menghubungi kami melalui:
              </p>
              <ul className="list-unstyled contact-list">
                <li><i className="bi bi-envelope-fill me-2 text-primary"></i> Email: diseprindag,esdm.garut@gmail.com</li>
                <li><i className="bi bi-telephone-fill me-2 text-primary"></i> Telepon: +62 813-2076-2941</li>
                <li><i className="bi bi-geo-alt-fill me-2 text-primary"></i> Alamat: Jalan Merdeka No.219, Jayaraga, Kec.Tarogong Kidul, Kabupaten Garut 44151</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;