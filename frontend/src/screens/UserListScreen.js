import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Table, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { USER_DETAILS_RESET } from '../constants/userConstants';

const UserListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userList = useSelector((state) => state.userList)
    const { loading, error, users } = userList

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    const userDelete = useSelector((state) => state.userDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
            dispatch({type:USER_DETAILS_RESET})
        } else {
            navigate('/signin')
        }
    }, [dispatch, navigate, successDelete, userInfo])
    const [show, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setDeleteId(id)
        setShow(true);
    }

    const deleteHandler = () => {
        setShow(false);
        dispatch(deleteUser(deleteId))
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
            <h1>Users</h1>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {successDelete && <Message variant='success'>User Deleted Successfully</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <Table striped bordered hover responsive className='table-sm text-center'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>IS ADMIN</th>
                                    <th>IS SELLER</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>
                                            <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                                        </td>
                                        <td>
                                            {user.isAdmin ? (
                                                <FontAwesomeIcon icon={faCheck} className="text-success" />
                                            ) : (
                                                    <FontAwesomeIcon icon={faTimes} className="text-danger" />
                                                )}
                                        </td>
                                        <td>
                                            {user.isSeller ? (
                                                <FontAwesomeIcon icon={faCheck} className="text-success" />
                                            ) : (
                                                    <FontAwesomeIcon icon={faTimes} className="text-danger" />
                                                )}
                                        </td>
                                        <td className="d-flex justify-content-evenly">
                                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                <Button variant='transparent' className='btn-sm'>
                                                    <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                variant='transparent'
                                                className='btn-sm'
                                                onClick={() => handleShow(user._id)}
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

export default UserListScreen
