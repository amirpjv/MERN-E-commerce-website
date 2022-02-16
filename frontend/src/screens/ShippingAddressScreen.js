import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import Loader from '../components/Loader';

const ShippingAddressScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin
    useEffect(() => {
        if (!userInfo || userInfo === null) {
            navigate('/signin')
        }
    }, [userInfo, navigate])
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart
    const userAddressMap = useSelector((state) => state.userAddressMap)
    const { address: addressMap } = userAddressMap
    const [lat, setLat] = useState(shippingAddress.lat);
    const [lng, setLng] = useState(shippingAddress.lng);
    const [fullName, setFullName] = useState(shippingAddress.fullName || '')
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
    const [country, setCountry] = useState(shippingAddress.country || '')

    const [show, setShow] = useState(false);
    const [moveOn, setMoveOn] = useState(false);
    const handleClose = () => {
        setMoveOn(false)
        setShow(false);
    }
    const continueHandler = () => {
        setMoveOn(true)
        setShow(false)
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        dispatch(
            saveShippingAddress({
                fullName,
                address,
                city,
                postalCode,
                country,
                lat: newLat,
                lng: newLng,
            })
        );
        navigate('/payment')
    }
    const submitHandler = (e) => {
        e.preventDefault()
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;
        if (addressMap) {
            setLat(addressMap.lat);
            setLng(addressMap.lng);
        }
        if (!newLat || !newLng) {
            setShow(true);
        }
    }

    const chooseOnMap = () => {
        dispatch(
            saveShippingAddress({
                fullName,
                address,
                city,
                postalCode,
                country,
                lat,
                lng,
            })
        );
        navigate('/map');
    };

    return (
        <Container fluid>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Continue</Modal.Title>
                </Modal.Header>
                <Modal.Body>You did not set your location on map. Continue?</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        No
          </Button>
                    <Button variant="danger" onClick={continueHandler}>
                        Yes
          </Button>
                </Modal.Footer>
            </Modal>
            {(!userInfo) ? (
                <Loader />
            ) : (
                    <Container fluid>
                        <CheckoutSteps step1 step2 />
                        <FormContainer>
                            <h1 className="pb-2">Shipping</h1>
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='fullName' className="py-2">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter full name'
                                        value={fullName}
                                        required
                                        onChange={(e) => setFullName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='address' className="py-2">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter address'
                                        value={address}
                                        required
                                        onChange={(e) => setAddress(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='city' className="py-2">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter city'
                                        value={city}
                                        required
                                        onChange={(e) => setCity(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='postalCode' className="py-2">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter postal code'
                                        value={postalCode}
                                        required
                                        onChange={(e) => setPostalCode(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='country' className="py-2">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter country'
                                        value={country}
                                        required
                                        onChange={(e) => setCountry(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                <Button type='button' variant='primary' className="my-3 w-100 text-dark border-0" onClick={chooseOnMap}>
                                    Choose On Map
                                </Button>
                                <Button type='submit' variant='warning' className="my-3 w-100 text-dark border-0">
                                    Continue
                                </Button>
                            </Form>
                        </FormContainer>
                    </Container>
                )}
        </Container>
    )
}

export default ShippingAddressScreen
