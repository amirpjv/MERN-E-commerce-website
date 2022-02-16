import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Table, Button, Row, Col, Modal, Pagination } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
    listProducts,
    deleteProduct,
    createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

const ProductListScreen = () => {
    const { pageNumber = 1 } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    const productDelete = useSelector((state) => state.productDelete)
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete

    const productCreate = useSelector((state) => state.productCreate)
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/signin')
        }
        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET })
            navigate(`/admin/product/${createdProduct.product._id}/edit`)
        }
        if (successDelete) {
            dispatch({ type: PRODUCT_DELETE_RESET })
        }
        dispatch(listProducts({ name: '', pageNumber }))
    }, [
        dispatch,
        navigate,
        userInfo,
        successDelete,
        successCreate,
        createdProduct,
        pageNumber,
    ])
    const [show, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setDeleteId(id)
        setShow(true);
    }

    const deleteHandler = () => {
        setShow(false);
        dispatch(deleteProduct(deleteId))
    }

    const createProductHandler = () => {
        dispatch(createProduct())
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
            <Row className='d-flex align-items-center py-2'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='d-flex justify-content-end float-end align-items-center'>
                    <Button variant="warning" className='my-3' onClick={createProductHandler}>
                        <FontAwesomeIcon icon={faPlus} className="text-info" /> Create Product
          </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <>
                            <Table striped bordered hover responsive className='table-sm text-center'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>BRAND</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td className="d-flex justify-content-evenly">
                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                    <Button variant='transparent' className='btn-sm'>
                                                        <FontAwesomeIcon icon={faEdit} className="text-success" />
                                                    </Button>
                                                </LinkContainer>
                                                <Button
                                                    variant='transparent'
                                                    className='btn-sm'
                                                    onClick={() => handleShow(product._id)}
                                                // onClick={() => deleteHandler(product._id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Row className="d-flex justify-content-center text-center my-3">
                                {
                                    (
                                        pages > 1 && (
                                            <Pagination className="d-flex justify-content-center text-center m-auto">
                                                {[...Array(pages).keys()].map((x) => (
                                                    <LinkContainer
                                                        key={x + 1}
                                                        to={`/admin/productlist/pageNumber/${x + 1}`}
                                                    >
                                                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                                                    </LinkContainer>
                                                ))}
                                            </Pagination>
                                        )
                                    )
                                }
                            </Row>
                        </>
                    )}
        </Container>
    )
}

export default ProductListScreen
