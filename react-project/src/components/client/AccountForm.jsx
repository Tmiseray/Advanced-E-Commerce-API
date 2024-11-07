
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { number } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner, Container, Row, Col } from "react-bootstrap";
import {Icon} from 'react-icons-kit';
import {eye, eyeOff} from 'react-icons-kit/feather';
import axios from "axios";

function AccountForm() {
    const [account, setAccount] = useState({ 
        username: '',
        password: ''
     });
    const [errors, setErrors] = useState({});
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [ isResetting, setIsResetting ] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id, newId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/accounts/${id}`)
                .then(response => {
                    setAccount(response.data);
                })
                .catch(error => setErrorMessage(error.message));
        }
    }, [id]);

    const validateForm = () => {
        let errors = {};
        if (!account.username || account.username.length < 8) errors.username = 'Username is required and must be atleast 8 characters';
        if (!account.password || account.password.length < 16) errors.password = 'Password is required and must be atleast 16 characters';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/accounts/${id}`, account);
            } else if (newId) {
                const requestData = {
                    ...account,
                    customer_id: newId
                };
                console.log("Request data:", requestData);
                await axios.post(`http://127.0.0.1:5000/create-account/${newId}`, requestData);
            }
            setShowSuccess(true);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsResetting(true);

        setTimeout(() => {
            setIsResetting(false);
        }, 1000);
    };

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAccount(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShowSuccess(false);
        setAccount({ username: '', password: '' });
        setSubmitting(false);
        if (id) {
            navigate(`/customer-profile/${id}`);
        } else {
            navigate('/login');
        }
    };

    if (isSubmitting) {
        return (
            <p>
                Submitting information 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </p>
        )
    };

    return (
        <Container>
            <Form className="accountForm p-4 mt-3 rounded" onSubmit={handleSubmit} >
                <h3 className="fs-1 text-warning" >{id ? 'Edit' : 'Add'} Account Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group as={Row} className="mb-2 p-3" controlId="accountUsername" >
                    <Form.Label column sm={2} className="fs-4" >Username:</Form.Label>
                    <Col sm={10} >
                        <Form.Control
                            className="mb-2 pb-0" 
                            size="lg"
                            type="text"
                            name="username"
                            value={account.username}
                            pattern="^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,}$" required
                            onChange={handleChange}
                            isInvalid={!!errors.username}
                            aria-describedby="usernameHelpBlock"
                        />
                        <Form.Text id="usernameHelpBlock" muted >
                            Your username must be atleast 8 characters long and contain atleast 1 uppercase letter, special character, and number.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 p-3" controlId="accountPassword" >
                    <Form.Label column sm={2} className="fs-4" >Password:</Form.Label>
                    <Col sm={9} >
                        <Form.Control 
                            className="mb-2 pb-0"
                            size="lg"
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={account.password}
                            pattern="^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{16,}$" required
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            aria-describedby="passwordHelpBlock"
                        />
                        <Form.Text id="passwordHelpBlock" muted >
                            Your password must be atleast 16 characters long and contain atleast 1 uppercase letter, special character, and number.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
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
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal className="text-center" show={showSuccess} onHide={() => setShowSuccess(false)} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-success">Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Account information has been successfully {id ? 'updated' : 'added'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} >
                        {id ? 'Continue to Profile' : 'Login'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

AccountForm.propTypes = {
    id: number,
    newId: number
};

export default AccountForm;