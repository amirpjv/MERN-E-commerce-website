import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta'

const HomeScreen = () => {
    const dispatch = useDispatch()
    const { pageNumber = 1 } = useParams();
    // const products = useSelector((state) => state.productsReducer.products); //RTK =>state -.- name in reducer in configureStore -.- name in createSlice in initialState
    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;
    useEffect(() => {
        dispatch(
            listProducts({ pageNumber })
        );
    }, [dispatch, pageNumber]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || pageNumber;
        return `/search/pageNumber/${filterPage}`;
    };
    return (
        <>
            <Meta title={'Wellcome Online Shop'} />
            <ProductCarousel />
            <Container fluid>
                <h2 className="mt-2">Products</h2>
                {
                    loading ? <Loader /> :
                        error ? <Message variant='danger'>{error}</Message> :
                            <Row className="d-flex justify-content-center">
                                {products.map(product =>
                                    <Col key={product._id} xl={3} lg={4} sm={6}> {/* width of each columns */}
                                        <Product product={product} />
                                    </Col>
                                )}
                            </Row>
                }
                <Row className="d-flex justify-content-center text-center my-3">
                    {
                        (
                            pages > 1 && (
                                <Pagination className="d-flex justify-content-center text-center m-auto">
                                    {[...Array(pages).keys()].map((x) => (
                                        <LinkContainer
                                            key={x + 1}
                                            className={x + 1 === page ? 'active' : ''}
                                            to={getFilterUrl({ page: x + 1 })}
                                        >
                                            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                                        </LinkContainer>
                                    ))}
                                </Pagination>
                            )
                        )
                    }
                </Row>
            </Container>
        </>
    );
}

export default HomeScreen;

