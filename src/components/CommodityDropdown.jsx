import Select from 'react-select';
import { Form } from 'react-bootstrap';

const CommodityDropdown = ({ selectedCommodity, onCommodityChange, options }) => {
  const commodityOptions = options.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <Form.Group controlId='commodityFilter' className='mb-3'>
      <Form.Label className='form-label-custom'>Pilih Komoditi</Form.Label>
      <Select
        options={commodityOptions}
        value={commodityOptions.find(opt => opt.value === selectedCommodity)}
        onChange={(selected) => onCommodityChange(selected?.value)}
        classNamePrefix="react-select"
        placeholder='-- Pilih Komoditi --'
        isClearable
      />
    </Form.Group>
  );
};

export default CommodityDropdown;
