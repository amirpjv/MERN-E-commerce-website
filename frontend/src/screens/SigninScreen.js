import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import { signin } from '../actions/userActions'

const SigninScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const userSignin = useSelector((state) => state.userSignin)
    const { loading, error, userInfo } = userSignin

    useEffect(() => {
        if (userInfo) {
            navigate({ pathname: '/' }, { replace: true })
        }
    }, [navigate, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(signin(email, password))
    }

    return (
        <FormContainer >
            <h1 className="pb-3">Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler} >
                <Form.Group controlId='email' className="py-2">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} className="text-warning fs-5" /></InputGroup.Text>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId='password' className="py-2">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><FontAwesomeIcon icon={faKey} className="text-warning fs-5" /></InputGroup.Text>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </InputGroup>
                </Form.Group>

                <Button type='submit' variant='primary' className="mt-4 bg-warning w-100 text-black border-0">
                    Sign In
                </Button>
            </Form>

            <Row className='py-4'>
                <Col>
                    New Customer?{' '}
                    <Link to='/register'>
                        Register
          </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default SigninScreen;

