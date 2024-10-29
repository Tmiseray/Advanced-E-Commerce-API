/*
- Create Customer Form: Develop a form component to capture and submit essential customer information, including name, email, and phone number. Make sure this matches what you did back in Module 6!!
 - Update Customer Form: Build a form component that allows users to update customer details, including the name, email, and phone number.
 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID

*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner, Container } from "react-bootstrap";
import axios from "axios";

function CustomerForm() {
    const [customer, setCustomer] = useState({ 
        name: '',
        email: '',
        phone: ''
     });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/customers/specified-id/?id=${id}`)
                .then(response => {
                    setCustomer(response.data);
                })
                .catch(error => setErrorMessage(error.message));
        }
    }, [id]);

    const validateForm = () => {
        let errors = {};
        if (!customer.name) errors.name = 'Name is required';
        if (!customer.email) errors.email = 'Email is required';
        if (!customer.phone) errors.phone = 'Phone is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/customers/${id}`, customer);
            } else {
                await axios.post('http://127.0.0.1:5000/customers', customer);
            }
            setShowSuccess(true);
            // Possibly add code here to redirect
            // if (id) => LoginForm
            // else => AccountForm
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCustomer(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShowSuccess(false);
        setCustomer({ name: '', email: '', phone: '' });
        setSubmitting(false);
        if (id) {
            navigate(`/customer-profile/${id}`);
        } else {
            navigate('/accounts');
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
                <h3>{id ? 'Edit' : 'Add'} Contact Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group controlId="customerName" >
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                        type="text"
                        name="name"
                        value={customer.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerEmail" >
                    <Form.Label>Email:</Form.Label>
                    <Form.Control 
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customerPhone" >
                    <Form.Label>Phone:</Form.Label>
                    <Form.Control 
                        type="tel"
                        name="phone"
                        value={customer.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.phone}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal show={showSuccess} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Contact information has been successfully {id ? 'updated' : 'added'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} >
                        {id ? 'Continue to Profile' : 'Account Creation'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerForm;