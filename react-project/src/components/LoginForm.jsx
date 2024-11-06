/*

 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID

*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Modal, Spinner, Row, Col } from "react-bootstrap";
import {Icon} from 'react-icons-kit';
import {eye, eyeOff} from 'react-icons-kit/feather';
import axios from "axios";

function LoginForm({ handleLogin, handleSuccessLogin }) {
    const [ name, setName ] = useState('');
    const [ id, setId ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [ isResetting, setIsResetting ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ showSuccess, setShowSuccess ] = useState(false);
    const [ showErrorMessage, setShowErrorMessage ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = sessionStorage.getItem('name');
        const storedUsername = sessionStorage.getItem('username');
        const adminStatus = sessionStorage.getItem('isAdmin')

        if (storedName) {
            setName(JSON.parse(storedName));
        } else {
            setName('');
        }

        if (storedUsername) {
            setUsername(JSON.parse(storedUsername));
        } else {
            setUsername('');
        }

        if (adminStatus) {
            setIsAdmin(JSON.parse(adminStatus));
        } else {
            setIsAdmin(false);
        }
        
    }, []);

    const validateForm = () => {
        let errors = {};
        if (!username || username.length < 8) errors.username = 'Username is required and must be atleast 8 characters';
        if (!password || password.length < 16) errors.password = 'Password is required and must be atleast 16 characters';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {username, password} );
            setId(response.data.id);
            if (username === 'admin#1A') {
                setIsAdmin(true);
            }
            const userData = {
                name: response.data.name,
                id: response.data.id,
                isAdmin: username === 'admin#1A',
            };
            handleLogin(userData);
            setIsLoggedIn(true);
            setShowSuccess(true);
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            setShowErrorMessage(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setShowErrorMessage(false);
        setIsResetting(true);
        setUsername('');
        setPassword('');

        setTimeout(() => {
            setIsResetting(false);
        }, 500);
    };
    
    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    if (isSubmitting) {
        return (
            <p className="text-center h2">
                Verifying information 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </p>
        )
    };

    return (
        <Container>
            <Form className="loginForm p-4 mt-3 rounded" onSubmit={handleSubmit} noValidate >
                <h3 className="fs-1 text-warning" >Login</h3>
                <Form.Group as={Row} className="mb-2 p-3" controlId="username" >
                    <Form.Label column sm={2} className="fs-4" >Username:</Form.Label>
                    <Col sm={10} >
                        <Form.Control
                            className="mb-2 pb-0"
                            size="lg"
                            type="text"
                            name="username"
                            value={username}
                            pattern="^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,}$" required
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            isInvalid={!!errors.username}
                            aria-describedby="usernameHelpBlock"
                            autoFocus
                        />
                        <Form.Text id="usernameHelpBlock" muted >
                            Your username must be atleast 8 characters long and contain atleast 1 uppercase letter, special character, and number.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" >
                            {errors.username}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 p-3" controlId="password" >
                    <Form.Label column sm={2} className="fs-4" >Password:</Form.Label>
                    <Col sm={9} >
                        <Form.Control
                            className="mb-2 pb-0"
                            size="lg"
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={password}
                            pattern="^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{16,}$" required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            isInvalid={!!errors.password}
                            aria-describedby="passwordHelpBlock"
                        />
                        <Form.Text id="passwordHelpBlock" muted >
                            Your password must be atleast 16 characters long and contain atleast 1 uppercase letter, special character, and number.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" >
                            {errors.username}
                        </Form.Control.Feedback>
                    </Col>
                    <Col className="justify-content-center" sm={1} >
                        <Icon className="eyeball pt-1 ps-2 pe-2 mt-1" size={32} icon={passwordVisible ? eyeOff : eye} onClick={togglePassword} style={{ cursor: 'pointer' }} />
                    </Col>
                </Form.Group>
                <Button className="w-50 fs-4" variant="outline-light" type="reset" onClick={handleReset} disabled={isResetting} >
                    {isResetting ? <Spinner as='span' animation="border" size="sm" /> : 'Reset' }
                </Button>
                <Button className="w-50 fs-4" variant="outline-info" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Login' }
                </Button>
            </Form>

            <Modal className="text-center" show={showErrorMessage} onHide={() => setShowErrorMessage(false)} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-danger" >Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    OOPS... It looks like the information you provided is incorrect or doesn't exist.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleReset}>Try Again</Button>
                    <Button variant="outline-info" onClick={() => navigate('/register')}>Register</Button>
                </Modal.Footer>
            </Modal>

            <Modal className="text-center" show={showSuccess} onHide={() => setShowSuccess(false)} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title as='h2' className="text-success" >Welcome Back!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isAdmin && <p>You have Admin Access!</p> }
                    You have successfully logged in! <br />
                    Redirecting to your profile
                    <Spinner animation="grow" size="sm" className="mx-3" />
                    <Spinner animation="grow" size="sm" className="mx-3" />
                    <Spinner animation="grow" size="sm" className="mx-3" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleSuccessLogin(isAdmin, id)}>Continue</Button>
                </Modal.Footer>
            </Modal>            
        </Container>
    );
};


export default LoginForm;