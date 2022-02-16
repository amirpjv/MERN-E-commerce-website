import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import { detailsUser, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = () => {
    const params = useParams();
    const { id: userId } = params;

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isSeller, setIsSeller] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector((state) => state.userUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/admin/userlist')
        } else {
            if (!user) {
                dispatch(detailsUser(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
                setIsSeller(user.isSeller)
            }
        }
    }, [dispatch, navigate, userId, user, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: userId, name, email, isSeller, isAdmin }))
    }

    return (
        <Container fluid>
            <Link to='/admin/userlist' className='btn btn-warning my-3'>
                Go Back
      </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name' className="py-2">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type='name'
                                        placeholder='Enter name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='email' className="py-2">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>

                                <Form.Group controlId='isSeller' className="py-2">
                                    <Form.Check
                                        type='checkbox'
                                        label='Is Seller'
                                        checked={isSeller}
                                        onChange={(e) => setIsSeller(e.target.checked)}
                                    ></Form.Check>
                                </Form.Group>

                                <Form.Group controlId='isAdmin' className="py-2">
                                    <Form.Check
                                        type='checkbox'
                                        label='Is Admin'
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    ></Form.Check>
                                </Form.Group>

                                <Button type='submit' variant='warning' className="my-3 bg-warning w-100 text-black border-0">
                                    Update
                                    </Button>
                            </Form>
                        )}
            </FormContainer>
        </Container>
    )
}

export default UserEditScreen
