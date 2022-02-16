import React, { useState, useEffect } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { detailsUser, updateUserProfile } from '../actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
// import { listMyOrders } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ProfileScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userSignin = useSelector((state) => state.userSignin)
    const { userInfo } = userSignin

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile

    // const orderListMy = useSelector((state) => state.orderListMy)
    // const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin')
        } else {
            if (!user) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(detailsUser(userInfo._id))
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [navigate, userInfo, userInfo._id, user,dispatch])

    const submitHandler = (e) => {
        e.preventDefault()
        toast.dismiss()
        if (password !== confirmPassword) {
            toast.error('Password and confirm password are not match')
        } else {
            dispatch(updateUserProfile({ userId: user._id, name, email, password }))
        }
    }

    return (
        <FormContainer>
            <Toaster />
            <h2 className="pb-3">User Profile</h2>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <>
                            {loadingUpdate && <Loader />}
                            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                            {successUpdate && <Message variant='success'>Profile Updated Successfully</Message>}
                            <Form onSubmit={submitHandler} className="mb-4">
                                <Form.Group controlId='name' className="py-1">
                                    <Form.Label>Name</Form.Label>
                                    <InputGroup className="">
                                        <InputGroup.Text><FontAwesomeIcon icon={faUser} className="text-warning fs-5" /></InputGroup.Text>
                                        <Form.Control
                                            type='name'
                                            placeholder='Enter name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        ></Form.Control>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId='email' className="py-1">
                                    <Form.Label>Email Address</Form.Label>
                                    <InputGroup className="">
                                        <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} className="text-warning fs-5" /></InputGroup.Text>
                                        <Form.Control
                                            type='email'
                                            placeholder='Enter email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        ></Form.Control>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId='password' className="py-1">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup className="">
                                        <InputGroup.Text><FontAwesomeIcon icon={faKey} className="text-warning fs-5" /></InputGroup.Text>
                                        <Form.Control
                                            type='password'
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        ></Form.Control>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId='confirmPassword' className="py-1">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <InputGroup className="">
                                        <InputGroup.Text><FontAwesomeIcon icon={faKey} className="text-warning fs-5" /></InputGroup.Text>
                                        <Form.Control
                                            type='password'
                                            placeholder='Confirm password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        ></Form.Control>
                                    </InputGroup>
                                </Form.Group>

                                <Button type='submit' variant='primary' className="mt-3 bg-warning w-100 text-black border-0">
                                    Update
                                </Button>
                            </Form>
                        </>
                    )}
        </FormContainer>
    )
}

export default ProfileScreen
