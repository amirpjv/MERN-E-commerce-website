import React, { useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import LoadingBox from '../components/Loader';
import MessageBox from '../components/Message';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../utils';

export default function SearchScreen() {
    const navigate = useNavigate();
    let {
        name = 'all',
        category = 'all',
        min = 0,
        max = 0,
        rating = 'all',
        order = 'newest',
        pageNumber = 1,
    } = useParams();
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;
    const productCategoryList = useSelector((state) => state.productCategoryList);
    const {
        loading: loadingCategories,
        error: errorCategories,
        categories,
    } = productCategoryList;
    useEffect(() => {
        dispatch(
            listProducts({
                name: name !== 'all' ? name : '',
                pageNumber,
                category: category !== 'all' ? category : '',
                min,
                max,
                rating,
                order,
            })
        );
    }, [category, dispatch, max, min, name, order, rating, pageNumber]);

    const getFilterUrl = (filter) => {
        const filterName = filter.name || name;
        const filterPage = filter.page || pageNumber;
        const filterCategory = filter.category || category;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
    };
    return (
        <Container fluid className="d-flex flex-column">
            <Row className="d-flex flex-row justify-content-between my-2">
                <Col>
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                                <h6 className="text-primary mt-1">{products.length} Results</h6>
                            )}
                </Col>
                <Col className="d-flex justify-content-end">
                    <h6 className='text-primary mt-1'>Sort by &nbsp;</h6>
                    <Form.Select
                        size="sm"
                        className="w-50"
                        value={order}
                        onChange={(e) => {
                            navigate(getFilterUrl({ order: e.target.value }));
                        }}
                        aria-label="Default select example">
                        <option value="newest">Newest Arrivals</option>
                        <option value="lowest">Price: Low to High</option>
                        <option value="highest">Price: High to Low</option>
                        <option value="toprated">Rating</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className="d-flex justify-content-between">
                <Col xs={3} sm={2} lg={2} xl={2} xxl={2} >
                    <h5>Department</h5>
                    <Container>
                        {loadingCategories ? (
                            <LoadingBox></LoadingBox>
                        ) : errorCategories ? (
                            <MessageBox variant="danger">{errorCategories}</MessageBox>
                        ) : (
                                    <ListGroup>
                                        <ListGroup.Item className="border-0 py-1">
                                            <Link
                                                className={'all' === category ? 'text-warning text-decoration-none fw-bold' : 'text-dark text-decoration-none hover-underline-animation'}
                                                to={getFilterUrl({ category: 'all' , page: 1})}
                                            >
                                                Any
                                            </Link>
                                        </ListGroup.Item>
                                        {categories.map((c) => (
                                            <ListGroup.Item key={c} className="border-0 py-1">
                                                {c === category ?
                                                    (<Link
                                                        className="text-warning text-decoration-none fw-bold"
                                                        to={getFilterUrl({ category: c, page: 1 })}
                                                    >
                                                        {c}
                                                    </Link>)
                                                    :
                                                    (<Link
                                                        className="text-dark text-decoration-none hover-underline-animation"
                                                        to={getFilterUrl({ category: c, page: 1 })}
                                                    >
                                                        {c}
                                                    </Link>)}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                    </Container>
                    <h5>Price</h5>
                    <Container>
                        <ListGroup>
                            {prices.map((p) => (
                                <ListGroup.Item key={p.name} className="border-0 py-1">
                                    <Link
                                        to={getFilterUrl({ min: p.min, max: p.max , page: 1})}
                                        className={
                                            `${p.min}-${p.max}` === `${min}-${max}` ? 'text-warning text-decoration-none fw-bold' : 'text-dark text-decoration-none hover-underline-animation'
                                        }
                                    >
                                        {p.name}
                                    </Link>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Container>
                    <h5>Rating</h5>
                    <Container>
                        <ListGroup>
                            <ListGroup.Item className="border-0 py-1">
                                <Link
                                    className={'all' === rating ? 'text-warning text-decoration-none fw-bold' : 'text-dark text-decoration-none hover-underline-animation'}
                                    to={getFilterUrl({ rating: 'all' , page: 1})}
                                >
                                    Any
                                </Link>
                            </ListGroup.Item>
                            {ratings.map((r) => (
                                <ListGroup.Item key={r.value} className="border-0 py-1">
                                    <Link
                                        to={getFilterUrl({ rating: r.value , page: 1})}
                                        className={`${r.value}` === `${rating}` ? 'text-warning text-decoration-none fw-bold' : 'text-dark text-decoration-none hover-underline-animation'}
                                    >
                                        <Rating caption={' & up'} value={r.value}></Rating>
                                    </Link>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Container>
                </Col>
                <Col xs={8} sm={9} lg={10} xl={10} xxl={10}>
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                                <>
                                    {products.length === 0 && (
                                        <MessageBox>No Product Found</MessageBox>
                                    )}
                                    <Row className="d-flex justify-content-center">
                                        {products.map(product =>
                                            <Col key={product._id} xl={4} lg={4} md={6} sm={9} xs={12}> {/* width of each columns */}
                                                <Product product={product} />
                                            </Col>
                                        )}
                                    </Row>
                                    <Row className="d-flex justify-content-center text-center my-3">
                                        {
                                            (
                                                pages > 1 && (
                                                    <Pagination className="d-flex justify-content-center text-center m-auto">
                                                        {[...Array(pages).keys()].map((x) => (
                                                            <LinkContainer
                                                                key={x + 1}
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
                                </>
                            )}
                </Col>
            </Row>
        </Container>
    );
}
