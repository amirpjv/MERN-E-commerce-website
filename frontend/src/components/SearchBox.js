import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SearchBox = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(`/search/name/${name}`);
    };

    return (
        <Form onSubmit={submitHandler} className="d-flex justify-content-center">
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setName(e.target.value)}
                placeholder='Search Products...'
                className='mr-sm-2 ml-sm-5 rounded-0 rounded-start'
                style={{ height: '2.2rem', marginTop: 'auto' }}
            ></Form.Control>
            <Button type='submit' variant='warning' size="sm" className="rounded-0 rounded-end">
                <FontAwesomeIcon icon={faSearch} className="text-dark" />
            </Button>
        </Form>
    )
}

export default SearchBox
