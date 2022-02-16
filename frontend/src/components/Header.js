import React, { useEffect } from 'react'
import { Navbar, Nav, Badge, NavDropdown, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'
import { listProductCategories } from '../actions/productActions';

const Header = () => {
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const logoutHandler = () => {
        dispatch(logout())
    }

    useEffect(() => {
        dispatch(listProductCategories())
    }, [dispatch])

    return (
        <header>
            <Navbar className="overflow-visible bg-secondary" collapseOnSelect expand="md">
                {/* <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="offcanvasNavbarDropdown">
                                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    Something else here
            </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas> */}
                <Navbar.Brand href="/" id="nav-brand" className="ms-5 text-white fs-5 ps-2">{`<Amir`}<span className="text-warning" id="brand-home">PJV</span>{`/>`}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-5" />
                <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                    <Container className="d-flex justify-content-center w-50">
                        <SearchBox />
                    </Container>
                    <Nav className="d-flex fw-bolder justify-content-center align-content-center align-items-center me-5">
                        <NavLink
                            to={'/'}
                            className={({ isActive }) =>
                                isActive ? 'text-warning mx-2 text-decoration-none' : 'mx-2 nav-links nav-link-ltr'
                            }
                        >
                            Home
                        </NavLink>
                        {(userInfo && userInfo.isAdmin) || <NavLink
                            to={'/cart'}
                            className={({ isActive }) =>
                                isActive ? 'text-warning text-decoration-none mx-xxl-5 mx-xl-5 mx-lg-5 mx-md-5' : 'mx-xxl-5 mx-xl-5 mx-lg-5 mx-md-5 nav-links nav-link-ltr'
                            }
                        >
                            Cart
                            {cartItems.length > 0 && (
                                <Badge className="rounded rounded-circle bg-danger">{cartItems.length}</Badge>
                            )}
                        </NavLink>}
                        {userInfo && userInfo.isAdmin ?
                            <NavDropdown title='Admin' id='adminmenu' drop={'down'} className="text-white me-xxl-5 me-xl-5 me-lg-5 me-md-5 me-sm-0 d-flex">
                                <NavDropdown.Item as={NavLink} to='/admin/dashboard'>
                                    Dashboard
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/userlist'>
                                    Users
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/productlist'>
                                    Products
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/orderlist'>
                                    Orders
                                </NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/support'>
                                    Support
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            :
                            userInfo ?
                                <NavDropdown title={userInfo.name} drop={"down"} id='usermenu' className="text-white me-xxl-5 me-xl-5 me-lg-5 me-md-5 me-sm-0 d-flex pe-xxl-5 pe-xl-5 pe-lg-5 pe-md-5 pe-sm-0">
                                    <NavDropdown.Item as={NavLink} to='/profile'>
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to='/orderhistory'>
                                        Order History
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                                :
                                <NavLink
                                    to={'/signin'}
                                    className={({ isActive }) =>
                                        isActive ? 'mx-2 text-warning text-decoration-none' : 'mx-2 nav-links nav-link-ltr'
                                    }
                                >
                                    Sign In
                                </NavLink>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
