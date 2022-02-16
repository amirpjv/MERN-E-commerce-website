import { Container, Row, Col } from 'react-bootstrap'
import ChatBox from './ChatBox';
import { useSelector } from 'react-redux';

const Footer = () => {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <footer>
            <Container fluid>
                <Container fluid className="text-end me-0">
                    {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
                </Container>
                <Row className="d-flex justify-content-evenly">
                    <Col className='text-center d-flex justify-content-center align-content-center align-items-center py-3 bg-secondary' id="footer">&copy; {new Date().getFullYear()} Copyright: AmirPJV</Col>
                    <Col className='text-center d-flex justify-content-center align-content-center align-items-center py-3 bg-secondary' id="footer">e-commerce website sample</Col>
                </Row>
            </Container>
        </footer>
    );
}




export default Footer;
