import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Container, Card, Row, Form, ListGroup, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faWindowClose } from '@fortawesome/free-solid-svg-icons'

const ENDPOINT =
    window.location.host.indexOf('localhost') >= 0
        ? 'http://127.0.0.1:5000'
        : window.location.host;

export default function ChatBox(props) {
    const { userInfo } = props;
    const [socket, setSocket] = useState(null);
    const uiMessagesRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([
        { name: 'Admin', body: 'Hello there, Please ask your question.' },
    ]);

    useEffect(() => {
        if (uiMessagesRef.current) {
            uiMessagesRef.current.scrollBy({
                top: uiMessagesRef.current.clientHeight,
                left: 0,
                behavior: 'smooth',
            });
        }
        if (socket) {
            socket.emit('onLogin', {
                _id: userInfo._id,
                name: userInfo.name,
                isAdmin: userInfo.isAdmin,
            });
            socket.on('message', (data) => {
                setMessages([...messages, { body: data.body, name: data.name }]);
            });
        }
    }, [messages, isOpen, socket, userInfo]);

    const supportHandler = () => {
        setIsOpen(true);
        const sk = socketIOClient(ENDPOINT);
        setSocket(sk);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        toast.dismiss()
        if (!messageBody.trim()) {
            toast.error('Error. Please type message.');
        } else {
            setMessages([...messages, { body: messageBody, name: userInfo.name }]);
            setMessageBody('');
            setTimeout(() => {
                socket.emit('onMessage', {
                    body: messageBody,
                    name: userInfo.name,
                    isAdmin: userInfo.isAdmin,
                    _id: userInfo._id,
                });
            }, 1000);
        }
    };
    const closeHandler = () => {
        setIsOpen(false);
    };
    return (
        <Container fluid className="me-0">
            <Toaster
                toastOptions={{
                    duration: 4000,
                }}
            />
            {!isOpen ? (
                <Button type="button" onClick={supportHandler} id="msgbox">
                    <FontAwesomeIcon icon={faComments} className="text-dark" />
                </Button>
            ) : (
                    <Card className="card card-body">
                        <Row className="mb-2">
                            <Container className="d-flex flex-row justify-content-between">
                                <strong className="mt-1">Support </strong>
                                <Button type="button" variant="danger" onClick={closeHandler}>
                                    <FontAwesomeIcon icon={faWindowClose} className="text-dark" />
                                </Button>
                            </Container>
                        </Row>
                        <ListGroup ref={uiMessagesRef} className="text-start">
                            {messages.map((msg, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>{`${msg.name}: `}</strong> {msg.body}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Row>
                            <Form onSubmit={submitHandler} className="text-start">
                                <Form.Group controlId='msg'>
                                    <InputGroup className="my-2">
                                        <Form.Control
                                            value={messageBody}
                                            onChange={(e) => setMessageBody(e.target.value)}
                                            type="text"
                                            placeholder="type message"
                                        ></Form.Control>
                                    </InputGroup>
                                    <Button type="submit" variant="warning" className="w-25">Send</Button>
                                </Form.Group>
                            </Form>
                        </Row>
                    </Card>
                )}
        </Container>
    );
}
