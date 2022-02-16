import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message'
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'

const PlaceOrderScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin
    const cart = useSelector((state) => state.cart)

    useEffect(() => {
        if (!userInfo || userInfo === null) {
            navigate('/signin')
        }
        else if (!cart.shippingAddress.address) {
            navigate('/shipping')
        }
        else if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [navigate, userInfo, cart])

    //   Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2)

    const orderCreate = useSelector((state) => state.orderCreate)
    const { order, success, loading, error } = orderCreate

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
        )
    }

    //   const placeOrderHandler = () => {
    //     dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
    //   };

    useEffect(() => {
        const fetchData = async () => {
            if (success) {
                await navigate(`/order/${order.order._id}`)
                dispatch({ type: USER_DETAILS_RESET })
                dispatch({ type: ORDER_CREATE_RESET })
            }
        }
        fetchData()
    }, [dispatch, navigate, success, order])

    return (
        <Container fluid>
            {(!userInfo) ? (
                <Loader />
            ) : (
                    <Container fluid>
                        <CheckoutSteps step1 step2 step3 step4 />
                        <Row>
                            <Col md={8}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Name:</strong>{' '}{cart.shippingAddress.fullName} <br />
                                            <strong>Address:</strong>{' '}
                                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                            {cart.shippingAddress.postalCode},{' '}
                                            {cart.shippingAddress.country}
                                        </p>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h2>Payment Method</h2>
                                        <strong>Method: </strong>
                                        {cart.paymentMethod}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <h2>Order Items</h2>
                                        {cart.cartItems.length === 0 ? (
                                            <Message>Your cart is empty</Message>
                                        ) : (
                                                <ListGroup variant='flush'>
                                                    {cart.cartItems.map((item, index) => (
                                                        <ListGroup.Item key={index}>
                                                            <Row className="d-flex justify-content-evenly align-items-center">
                                                                <Col md={1}>
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        fluid
                                                                        rounded
                                                                    />
                                                                </Col>
                                                                <Col>
                                                                    <Link to={`/product/${item.product}`} className="ms-5 text-decoration-none">
                                                                        {item.name}
                                                                    </Link>
                                                                </Col>
                                                                <Col md={4}>
                                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h2>Order Summary</h2>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Items</Col>
                                                <Col>${cart.itemsPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping</Col>
                                                <Col>${cart.shippingPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax</Col>
                                                <Col>${cart.taxPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Total</Col>
                                                <Col>${cart.totalPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Button
                                                type='button'
                                                className="btn-block my-3 w-100 text-dark bg-warning border-0"
                                                disabled={cart.cartItems.length === 0}
                                                onClick={placeOrderHandler}
                                            >
                                                Place Order
                                            </Button>
                                        </ListGroup.Item>
                                        {error && <ListGroup.Item>
                                            <Message variant='danger'>{error}</Message>
                                        </ListGroup.Item>}
                                        {loading && <ListGroup.Item>
                                            <Loader />
                                        </ListGroup.Item>}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )
            }
        </Container >
    )
}

export default PlaceOrderScreen
