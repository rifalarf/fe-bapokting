import { Row, Col } from 'react-bootstrap';
import DateFilter from './DateFilter';
import KetFilter from './KetFilter';
import MarketDropdown from './MarketDropdown';
import SearchBar from './SearchBar';

const TableAction = ({
  selectedDate,
  onDateChange,
  selectedMarket,
  onMarketChange,
  selectedKeterangan,
  onKeteranganChange,
  searchKeyword,
  onSearchChange
})  => {
  return (
    <Row className="mb-3">
      <Col md={3}>
        <MarketDropdown selectedMarket={selectedMarket} onChange={onMarketChange} />
      </Col>
      <Col md={3}>
        <DateFilter selectedDate={selectedDate} onDateChange={onDateChange} />
      </Col>
      <Col md={3}>
        <KetFilter selectedKeterangan={selectedKeterangan} onChange={onKeteranganChange} />
      </Col>
      <Col md={3}>
        <SearchBar keyword={searchKeyword} onChange={onSearchChange} />
      </Col>
    </Row>
  );
};

export default TableAction;