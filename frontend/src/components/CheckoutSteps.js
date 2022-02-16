import React from 'react'
import { Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-evenly mb-4'>
      <Nav.Item>
        {step1 ? (
          <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-6" />
            <LinkContainer to='/signin' className="border-bottom border-3 border-warning">
              <Nav.Link className="text-warning">Sign In</Nav.Link>
            </LinkContainer>
          </Container>
        ) : (
            <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-danger fs-6" />
              <Nav.Link disabled className="border-bottom border-3 border-secondary">Sign In</Nav.Link>
            </Container>
          )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-6" />
            <LinkContainer to='/shipping' className="border-bottom border-3 border-warning">
              <Nav.Link className="text-warning">Shipping</Nav.Link>
            </LinkContainer>
          </Container>
        ) : (
            <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-danger fs-6" />
              <Nav.Link disabled className="border-bottom border-3 border-secondary">Shipping</Nav.Link>
            </Container>
          )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-6" />
            <LinkContainer to='/payment' className="border-bottom border-3 border-warning">
              <Nav.Link className="text-warning">Payment</Nav.Link>
            </LinkContainer>
          </Container>
        ) : (
            <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-danger fs-6" />
              <Nav.Link disabled className="border-bottom border-3 border-secondary">Payment</Nav.Link>
            </Container>
          )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-6" />
            <LinkContainer to='/placeorder' className="border-bottom border-3 border-warning">
              <Nav.Link className="text-warning">Place Order</Nav.Link>
            </LinkContainer>
          </Container>
        ) : (
            <Container fluid className="d-flex justify-content-center my-auto align-content-center align-items-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-danger fs-6" />
              <Nav.Link disabled className="border-bottom border-3 border-secondary">Place Order</Nav.Link>
            </Container>
          )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
