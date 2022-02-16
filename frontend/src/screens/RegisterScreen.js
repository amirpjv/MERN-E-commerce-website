import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { register } from '../actions/userActions'
import toast, { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Too Short!').max(20, 'Too Long!').required('Please Enter a name').trim(),
    email: Yup.string().required('Email is required').matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter correct email address"
    ),
    password: Yup.string().required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: Yup.string().required('Confirm password is required')
        .oneOf([Yup.ref("password"), null], "Passwords must match")

});

const formInitialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const RegisterScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const userRegister = useSelector((state) => state.userRegister)
    const { loading, error, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate({ pathname: '/' }, { replace: true })
        }
    }, [navigate, userInfo])

    const submitHandler = (values) => {
        toast.dismiss()
        const name = values.name.replace(/\s/g, '')
        const email = values.email
        const password = values.password
        const confirmPassword = values.confirmPassword
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.')
            return
        }
        else {
            dispatch(register(name, email, password))
        }
    }

    return (
        <FormContainer>
            <Toaster />
            <h1 className="pb-3">Register</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Formik
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => submitHandler(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => {
                    return (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-2" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faUser} className="text-warning fs-4" /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={values.name.trim()}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.name && !errors.name}
                                        isInvalid={touched.name && errors.name}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon2"><FontAwesomeIcon icon={faEnvelope} className="text-warning fs-4" /></InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={touched.email && errors.email}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon3"><FontAwesomeIcon icon={faKey} className="text-warning fs-4" /></InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.password && !errors.password}
                                        isInvalid={touched.password && errors.password}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon4"><FontAwesomeIcon icon={faKey} className="text-warning fs-4" /></InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.confirmPassword && !errors.confirmPassword}
                                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                                    />
                                    <Form.Control.Feedback></Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Button variant="warning" type="submit" className="w-100 mb-3">
                                Register
                                        </Button>
                            <Row className='py-2'>
                                <Col>
                                    Already have an account?{' '}
                                    <Link to='/signin'>
                                        Sign-In
          </Link>
                                </Col>
                            </Row>
                        </Form>
                    )
                }}
            </Formik>
        </FormContainer>
    )
}

export default RegisterScreen;


// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'
// import Loader from '../components/Loader';
// import Message from '../components/Message';
// import FormContainer from '../components/FormContainer'
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
// import { register } from '../actions/userActions'
// import toast, { Toaster } from 'react-hot-toast';

// const RegisterScreen = () => {
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [confirmPassword, setConfirmPassword] = useState('')

//     const dispatch = useDispatch()
//     const navigate = useNavigate();

//     const userRegister = useSelector((state) => state.userRegister)
//     const { loading, error, userInfo } = userRegister

//     useEffect(() => {
//         if (userInfo) {
//             navigate({ pathname: '/' }, { replace: true })
//         }
//     }, [navigate, userInfo])

//     const submitHandler = (e) => {
//         e.preventDefault()
//         toast.dismiss()
//         if (password !== confirmPassword) {
//             toast.error('Password and confirm password are not match')
//         } else {
//             dispatch(register(name, email, password))
//         }
//     }

//     return (
//         <FormContainer>
//             <Toaster />
//             <h1 className="pb-3">Register</h1>
//             {error && <Message variant='danger'>{error}</Message>}
//             {loading && <Loader />}
//             <Form onSubmit={submitHandler}>
//                 <Form.Group controlId='name' className="py-1">
//                     <Form.Label>Name</Form.Label>
//                     <InputGroup className="">
//                         <InputGroup.Text><FontAwesomeIcon icon={faUser} className="text-warning fs-5" /></InputGroup.Text>
//                         <Form.Control
//                             type='text'
//                             placeholder='Enter name'
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                         ></Form.Control>
//                     </InputGroup>
//                 </Form.Group>

//                 <Form.Group controlId='email' className="py-1">
//                     <Form.Label>Email Address</Form.Label>
//                     <InputGroup className="">
//                         <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} className="text-warning fs-5" /></InputGroup.Text>
//                         <Form.Control
//                             type='email'
//                             placeholder='Enter email'
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         ></Form.Control>
//                     </InputGroup>
//                 </Form.Group>

//                 <Form.Group controlId='password' className="py-1">
//                     <Form.Label>Password</Form.Label>
//                     <InputGroup className="">
//                         <InputGroup.Text><FontAwesomeIcon icon={faKey} className="text-warning fs-5" /></InputGroup.Text>
//                         <Form.Control
//                             type='password'
//                             placeholder='Enter password'
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         ></Form.Control>
//                     </InputGroup>
//                 </Form.Group>

//                 <Form.Group controlId='confirmPassword' className="py-1">
//                     <Form.Label>Confirm Password</Form.Label>
//                     <InputGroup className="">
//                         <InputGroup.Text><FontAwesomeIcon icon={faKey} className="text-warning fs-5" /></InputGroup.Text>
//                         <Form.Control
//                             type='password'
//                             placeholder='Enter confirm password'
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                         ></Form.Control>
//                     </InputGroup>
//                 </Form.Group>

//                 <Button type='submit' variant='primary' className="mt-3 bg-warning w-100 text-black border-0">
//                     Register
//                 </Button>
//             </Form>

//             <Row className='py-2'>
//                 <Col>
//                     Already have an account?{' '}
//                     <Link to='/signin'>
//                         Sign-In
//           </Link>
//                 </Col>
//             </Row>
//         </FormContainer>
//     )
// }

// export default RegisterScreen;
