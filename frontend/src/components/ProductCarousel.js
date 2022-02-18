import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const ProductCarousel = () => {
    const dispatch = useDispatch()

    const productTopRated = useSelector((state) => state.productTopRated)
    const { loading, error, products } = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    const directionButtons = (direction) => {
        return (
            <Badge className="bg-transparent">
                {
                    direction ?
                        <FontAwesomeIcon icon={faChevronRight} className="text-warning fs-3" />
                        : <FontAwesomeIcon icon={faChevronLeft} className="text-warning fs-3" />
                }
            </Badge>
        );
    };

    return (
        <>
            { loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        // <Carousel pause='hover' className='bg-dark'>
                        <Carousel pause='hover' className='bg-dark' indicators={false} nextIcon={directionButtons(true)} prevIcon={directionButtons(false)}>
                            {products.map((product) => (
                                <Carousel.Item key={product._id}>
                                    <Link to={`/product/${product._id}`}>
                                        {/* <Image src={product.image} alt={product.name} fluid /> */}
                                        <Image src={product.image} alt={product.name} fluid className="d-block mx-auto w-75" style={{ maxHeight: '400px' }} />
                                        {/* <Carousel.Caption className='carousel-caption'> */}
                                        <Carousel.Caption >
                                            <h4 className="text-warning">
                                                {product.name} (${product.price})
                                            </h4>
                                        </Carousel.Caption>
                                    </Link>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )
            }
        </>
    )
}

export default ProductCarousel