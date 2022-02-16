import React from 'react'
import { Container } from 'react-bootstrap'
import '../spinner.css';

const Loader = (props) => {
  return (
    // <Spinner
    //   animation='border'
    //   role='status'
    //   style={{
    //     width: '100px',
    //     height: '100px',
    //     margin: 'auto',
    //     display: 'block',
    //   }}
    // >
    //   <span className='sr-only'>Loading...</span>
    // </Spinner>
    <Container className="position-fixed h-100 mw-100 text-center loading"
      style={{ background: '#0008', color: 'white', top: 0, left: 0, zIndex: 9 }}>
      <svg width="205" height="250" viewBox="0 0 40 50">
        <polygon strokeWidth="1" stroke="#fff" fill="none"
          points="20,1 40,40 1,40"></polygon>
        <text fill="#fff" x="5" y="47">Loading</text>
      </svg>
    </Container>
  )
}

export default Loader