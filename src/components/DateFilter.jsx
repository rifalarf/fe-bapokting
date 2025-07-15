import { forwardRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';

registerLocale('id', id);

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <InputGroup>
    <Form.Control
      type='text'
      onClick={onClick}
      value={value}
      ref={ref}
      className='form-control form-control-custom'
      readOnly
      placeholder='Pilih Tanggal'
    />
    <InputGroup.Text className='input-group-text-custom' onClick={onClick}>
      <i className='bi bi-calendar-check'></i>
    </InputGroup.Text>
  </InputGroup>
));

CustomDateInput.displayName = 'CustomDateInput';

const DateFilter = ({ selectedDate, onDateChange }) => {
  const parsedDate = selectedDate ? new Date(selectedDate) : null;

  return (
    <Form.Group controlId='dateFilter' className='mb-3'>
      <Form.Label className='form-label-custom'>Pilih Tanggal</Form.Label>
      <DatePicker
        selected={parsedDate}
        onChange={(date) => {
          const formatted = date.toISOString().split('T')[0];
          onDateChange(formatted);
        }}
        dateFormat='dd/MM/yyyy'
        locale='id'
        customInput={<CustomDateInput />}
      />
    </Form.Group>
  );
};

export default DateFilter;
