import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { createReview, detailsProduct } from '../actions/productActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';
import toast, { Toaster } from 'react-hot-toast';

const ProductScreen = () => {
    const params = useParams()
    // const { id: productId } = params;
    const productId = params.id
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails
    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
    } = productReviewCreate;

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    useEffect(() => {
        if(errorReviewCreate){
            toast.dismiss()
            toast.error(errorReviewCreate)
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
        }
        if (successReviewCreate) {
            toast.dismiss()
            toast.success('Review Submitted Successfully')
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
        }
        dispatch(detailsProduct(productId))
    }, [dispatch, productId, successReviewCreate,errorReviewCreate])

    const addToCartHandler = () => {
        navigate({ pathname: `/cart/${params.id}?qty=${qty}` }, { replace: true })
        // navigate(`/cart/${params.id}?qty=${qty}`, { replace: true });
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(
            createReview(productId, {
                rating,
                comment,
            })
        )
    }

    return (
        <Container fluid>
            <Toaster 
              toastOptions={{
                duration: 4000,
                }}
            />
            <Link className='btn btn-warning ms-4 my-2' to='/'>
                Go Back
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <Container fluid>
                            <Meta title={product.name} />
                            <Row>
                                <Col md={6} className="d-flex justify-content-center">
                                    <Image src={product.image} alt={product.name} fluid style={{maxWidth:'600px',maxHeight:'600px'}} className="my-3 overflow-hidden" />
                                </Col>
                                <Col md={3}>
                                    <ListGroup variant='flush' className="my-3">
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating
                                                value={product.rating}
                                                text={` ${product.numReviews} reviews`}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                                        <ListGroup.Item>
                                            Description: {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={3}>
                                    <Card className="my-3">
                                        <ListGroup variant='flush'>

                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Brand:</Col>
                                                    <Col>
                                                        <strong>{product.brand}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>${product.price}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                                                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col className="d-flex justify-content-start my-auto">Qty:</Col>
                                                        <Col>
                                                            <Form.Select
                                                                as='select'
                                                                value={qty}
                                                                size="sm"
                                                                onChange={(e) => setQty(e.target.value)}
                                                            >
                                                                {[...Array(product.countInStock).keys()].map(
                                                                    (x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </Form.Select>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}

                                            <ListGroup.Item>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn text-dark bg-warning border-0 w-100'
                                                    type='button'
                                                    disabled={product.countInStock === 0}
                                                >
                                                    Add To Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <h2>Reviews</h2>
                                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                    <ListGroup variant='flush'>
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item>
                                            <h2>Write a Customer Review</h2>
                                            {loadingReviewCreate && <Loader />}
                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId='comment' className="my-2">
                                                        <Form.Label>Comment</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='3'
                                                            required
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                        ></Form.Control>
                                                    </Form.Group>
                                                    <Button
                                                        disabled={loadingReviewCreate}
                                                        type='submit'
                                                        variant='warning'
                                                    >
                                                        Submit
                                                    </Button>
                                                </Form>
                                            ) : (
                                                    <Message>
                                                        Please <Link to='/signin'>sign in</Link> to write a review{' '}
                                                    </Message>
                                                )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Container>
                    )}
        </Container>
    );
}

export default ProductScreen;


