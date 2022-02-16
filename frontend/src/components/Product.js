import { Container, Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Product = ({ product }) => {
    return (
        <Container fluid className="d-flex justify-content-evenly">
            <Card style={{ width: '17rem' }} className="my-3">
                <Link to={`/product/${product._id}`}>
                    <Card.Img as={Image} variant="top" src={product.image} alt={product.name} rounded width={286} height={286} />
                </Link>
                <Card.Body>
                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                        <Card.Title><strong>{product.name}</strong></Card.Title>
                    </Link>
                    <Rating
                        value={product.rating}
                        text={` ${product.numReviews} reviews`}
                    />
                    <Card.Text>${product.price}</Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Product;