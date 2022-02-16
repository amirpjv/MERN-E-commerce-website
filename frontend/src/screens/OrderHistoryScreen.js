import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrderMine } from '../actions/orderActions'
import { useNavigate } from 'react-router-dom';

const OrderHistoryScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const orderMineList = useSelector((state) => state.orderMineList)
    const { loading, error, orders } = orderMineList

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    useEffect(() => {
        if (userInfo) {
            dispatch(listOrderMine())
        } else {
            navigate('/signin')
        }
    }, [dispatch, navigate, userInfo])

    return (
        <Container fluid>
            <h1>Order History</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <Table striped bordered hover responsive className='table-sm text-center'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt.substring(0, 10)
                                            ) : (
                                                    "No"
                                                )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                order.deliveredAt.substring(0, 10)
                                            ) : (
                                                    "No"
                                                )}
                                        </td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button variant='warning' className='btn-sm'>
                                                    Details
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </Container>
    )
}

export default OrderHistoryScreen
