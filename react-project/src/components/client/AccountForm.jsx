
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function AccountForm() {
    const [account, setAccount] = useState({ 
        username: '',
        password: ''
     });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
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
        if (!account.username) errors.username = 'Username is required';
        if (!account.password) errors.password = 'Password is required';
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
            } else {
                await axios.post('http://127.0.0.1:5000/accounts', account);
            }
            setShowSuccess(true);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
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

    if (isSubmitting) return 
        <p>
            Submitting information 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container>
            <Form onSubmit={handleSubmit} >
                <h3>{id ? 'Edit' : 'Add'} Account Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group controlId="accountUsername" >
                    <Form.Label>Username:</Form.Label>
                    <Form.Control 
                        type="text"
                        name="username"
                        value={customer.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="accountPassword" >
                    <Form.Label>Password:</Form.Label>
                    <Form.Control 
                        type="text"
                        name="password"
                        value={customer.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal show={showSuccess} onHide={handleClose} centered >
                <Modal.Header>
                    <Modal.Title>Success</Modal.Title>
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

export default AccountForm;