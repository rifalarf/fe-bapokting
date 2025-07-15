import { Form, InputGroup } from 'react-bootstrap';

const SearchBar = ({ keyword, onKeywordChange, label }) => {
  return (
    <Form.Group controlId='searchKeyword' className='mb-3'>
      <Form.Label className='form-label-custom'>{label || 'Cari Komoditas'}</Form.Label>
      <InputGroup>
        <Form.Control
          type='text'
          placeholder={label ? `${label.toLowerCase().replace('Cari ', '')}...` : 'Cari komoditas...'}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className='form-control-custom'
        />
        <InputGroup.Text className='input-group-text-custom'>
          <i className='bi bi-search'></i>
        </InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
};

export default SearchBar;
