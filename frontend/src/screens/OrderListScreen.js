import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders, deleteOrder } from '../actions/orderActions'
import { useNavigate } from 'react-router-dom';
import { ORDER_DELETE_RESET } from '../constants/orderConstants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'

const OrderListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const orderList = useSelector((state) => state.orderList)
    const { loading, error, orders } = orderList

    const orderDelete = useSelector((state) => state.orderDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = orderDelete

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch({ type: ORDER_DELETE_RESET })
            dispatch(listOrders())
        } else {
            navigate('/signin')
        }
    }, [dispatch, navigate, userInfo, successDelete])

    const [show, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setDeleteId(id)
        setShow(true);
    }

    const deleteHandler = () => {
        setShow(false);
        dispatch(deleteOrder(deleteId))
    }

    return (
        <Container fluid>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        No
          </Button>
                    <Button variant="danger" onClick={deleteHandler}>
                        Yes
          </Button>
                </Modal.Footer>
            </Modal>
            <h1>Orders</h1>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <Table striped bordered hover responsive className='table-sm text-center'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER</th>
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
                                        <td>{order.user && order.user.name}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt.substring(0, 10)
                                            ) : (
                                                    <FontAwesomeIcon icon={faTimes} className="text-danger" />
                                                )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                order.deliveredAt.substring(0, 10)
                                            ) : (
                                                    <FontAwesomeIcon icon={faTimes} className="text-danger" />
                                                )}
                                        </td>
                                        <td className="d-flex justify-content-evenly">
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button variant='transparent' className='btn-sm'>
                                                    <FontAwesomeIcon icon={faInfo} className="text-info" />
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                variant='transparent'
                                                className='btn-sm'
                                                onClick={() => handleShow(order._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
        </Container>
    )
}

export default OrderListScreen
