import Select from 'react-select';
import { Form } from 'react-bootstrap';

const KetFilter = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = [
    { value: '', label: 'Semua' },
    { value: 'Naik', label: 'Naik' },
    { value: 'Turun', label: 'Turun' },
    { value: 'Tetap', label: 'Tetap' },
  ];

  return (
    <Form.Group controlId='statusFilter' className='mb-3'>
      <Form.Label className='form-label-custom'>Status Keterangan</Form.Label>
      <Select
        options={statusOptions}
        value={statusOptions.find(opt => opt.value === selectedStatus)}
        onChange={(selected) => onStatusChange(selected?.value)}
        classNamePrefix="react-select"
        placeholder='-- Pilih Keterangan --'
        isClearable
      />
    </Form.Group>
  );
};

export default KetFilter;
