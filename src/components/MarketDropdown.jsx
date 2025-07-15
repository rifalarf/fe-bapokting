import Select from 'react-select';
import { Form } from 'react-bootstrap';

const MarketDropdown = ({ selectedMarket, onMarketChange }) => {
  const marketOptions = [
    { value: '170', label: 'Pasar Guntur' },
    { value: '171', label: 'Pasar Kadungora' },
    { value: '172', label: 'Pasar Wanaraja' },
    { value: '173', label: 'Pasar Pameungpeuk' },
  ];

  return (
    <Form.Group controlId='marketFilter' className='mb-3'>
      <Form.Label className='form-label-custom'>Pilih Pasar</Form.Label>
      <Select
        options={marketOptions}
        value={marketOptions.find(opt => opt.value === selectedMarket)}
        onChange={(selected) => onMarketChange(selected?.value)}
        classNamePrefix="react-select"
        placeholder='-- Pilih Pasar --'
        isClearable
      />
    </Form.Group>
  );
};

export default MarketDropdown;
