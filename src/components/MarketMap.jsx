import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const marketData = [
  {
    id: 1,
    name: 'Pasar Guntur Ciawitali',
    upt_name: 'UPT Wilayah II',
    head_name: 'Mohammad Husenudin, S.IP',
    phone: '085314657009',
    address: 'Pasar Ciawitali Garut, Jl. Guntur Madu No.10, Haurpanggung, Kecamatan Tarogong Kidul, Kabupaten Garut, 44151',
    lat: -7.20017159075517,
    lng: 107.90340201092938,
  },
  {
    id: 2,
    name: 'Pasar Kadungora',
    upt_name: 'UPT Wilayah XI',
    head_name: 'Nandang Wahyudin, S.HI',
    phone: '082388123993',
    address: 'Jl. Raya Ps Baru Kadungora, Talagasari, Kecamatan Kadungora, Kabupaten Garut, 44153',
    lat: -7.084218890920823,
    lng: 107.8951819632955,
  },
  {
    id: 3,
    name: 'Pasar Wanaraja',
    upt_name: 'UPT Wilayah V',
    head_name: 'Mahmud Daryana, S.E',
    phone: '081220348377',
    address: 'Wanamekar, Kecamatan Wanaraja, Kabupaten Garut, 44151',
    lat: -7.1746768830153504,
    lng: 107.98030268168439,
  },
  {
    id: 4,
    name: 'Pasar Pameungpeuk',
    upt_name: 'UPT Wilayah XVII',
    head_name: 'Ijang Saprudin, S.IP',
    phone: '081320541333',
    address: 'Jl. Mekarjaya, Kecamatan Bungbulang, Kabupaten Garut',
    lat: -7.451175778293851,
    lng: 107.88994789123535,
  },
];

const MarketMap = () => {
  return (
    <MapContainer center={[-7.2, 107.9]} zoom={10} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marketData.map((market) => (
        <Marker key={market.id} position={[market.lat, market.lng]} icon={markerIcon}>
          <Popup>
            <strong>{market.name}</strong><br />
            {market.upt_name}<br />
            Kepala: {market.head_name}<br />
            Alamat : {market.address}<br />
            <a
              href={`https://wa.me/${market.phone.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi via WA
            </a><br />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${market.lat},${market.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Google Maps
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MarketMap;
