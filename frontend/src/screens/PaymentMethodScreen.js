import React, { useState, useEffect } from 'react'
import { Form, Button, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import Loader from '../components/Loader';

const PaymentMethodScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    useEffect(() => {
        if (!userInfo || userInfo === null) {
            navigate('/signin')
        }
        else if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [navigate, userInfo, shippingAddress])

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <Container fluid>
            {(!userInfo) ? (
                <Loader />
            ) : (
                    <Container fluid>
                        <CheckoutSteps step1 step2 step3 />
                        <FormContainer>
                            <h1>Payment Method</h1>
                            <Form onSubmit={submitHandler}>
                                <Form.Group>
                                    <Form.Label as='legend' className="mb-3">Select Method</Form.Label>
                                    <Col>
                                        <Form.Check
                                            type='radio'
                                            label='PayPal'
                                            id='PayPal'
                                            name='paymentMethod'
                                            value='PayPal'
                                            checked
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        ></Form.Check>
                                        {/* <Form.Check
                                            type='radio'
                                            label='Stripe'
                                            id='Stripe'
                                            name='paymentMethod'
                                            value='Stripe'
                                            checked
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        ></Form.Check> */}
                                    </Col>
                                </Form.Group>

                                <Button type='submit' variant='primary' className="my-3 w-100 text-dark bg-warning border-0">
                                    Continue
                                </Button>
                            </Form>
                        </FormContainer>
                    </Container>
                )}
        </Container>
    )
}

export default PaymentMethodScreen
