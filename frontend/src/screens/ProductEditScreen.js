import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { detailsProduct, updateProduct } from '../actions/productActions';
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { Link } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { id: productId } = params;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [rating, setRating] = useState('');
    const [numReviews, setNumReviews] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {
            navigate('/admin/productlist');
        }
        if (!product || product._id !== productId || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(detailsProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setRating(product.rating);
            setNumReviews(product.numReviews);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [product, dispatch, productId, successUpdate, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateProduct({
                _id: productId,
                name,
                price,
                image,
                category,
                brand,
                countInStock,
                rating,
                numReviews,
                description,
            })
        );
    };
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const uploadFileHandler = async (e) => {
        setErrorUpload(false);
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setImage(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };

    return (
        <Container fluid>
            <Link to='/admin/productlist' className='btn btn-warning my-3'>
                Go Back
      </Link>
            <FormContainer>
                <h1 className="pb-3">Edit Product</h1>
                {loadingUpdate && <Loader></Loader>}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? (
                    <Loader></Loader>
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name' className="py-1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type='name'
                                        placeholder='Enter name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='price' className="py-1">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='Enter price'
                                        min='0'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='image' className="py-1">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter image url'
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group controlId='imageFile' className="py-1">
                                    {/* <Form.File
                                        id='imageFile'
                                        label='Choose File'
                                        custom
                                        onChange={uploadFileHandler}
                                    ></Form.File> */}
                                    <Form.Label>Image File</Form.Label>
                                    <Form.Control
                                        type='file'
                                        label='Choose File'
                                        // custom
                                        accept="image/png, image/jpg, image/jpeg"
                                        onChange={uploadFileHandler}
                                    ></Form.Control>
                                    {/* <input
                                        type="file"
                                        id="imageFile"
                                        label="Choose Image"
                                        onChange={uploadFileHandler}
                                    ></input> */}
                                    {loadingUpload && <Loader></Loader>}
                                    {errorUpload && (
                                        <Message variant="danger">{errorUpload}</Message>
                                    )}
                                </Form.Group>

                                <Form.Group controlId='brand' className="py-1">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='countInStock' className="py-1">
                                    <Form.Label>Count In Stock</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min='0'
                                        placeholder='Enter countInStock'
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='rating' className="py-1">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        type='number'
                                        step='.1'
                                        min='0'
                                        max='5'
                                        maxLength='3'
                                        placeholder='Enter rating'
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='numReviews' className="py-1">
                                    <Form.Label>Number Of Reviews</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min='0'
                                        placeholder='Enter reviews'
                                        value={numReviews}
                                        onChange={(e) => setNumReviews(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='category' className="py-1">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter category'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='description' className="py-1">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Button type='submit' variant='warning' className="my-3 bg-warning w-100 text-black border-0">
                                    Update
                                    </Button>
                            </Form>
                        )}

            </FormContainer>
        </Container >
    );
}

export default ProductEditScreen