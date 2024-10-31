/*
- Create Customer Form: Develop a form component to capture and submit essential customer information, including name, email, and phone number. Make sure this matches what you did back in Module 6!!
 - Update Customer Form: Build a form component that allows users to update customer details, including the name, email, and phone number.
 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID

*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

function CustomerForm() {
    const [customer, setCustomer] = useState({ 
        name: '',
        email: '',
        phone: ''
     });
    const [newId, setNewId] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/customers/${id}`)
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
                const response = await axios.post('http://127.0.0.1:5000/register', customer);
                const customerId = response.data.customer_id;
                setNewId(customerId);
            }
            setShowSuccess(true);
            // Possibly add code here to redirect
            // if (id) => LoginForm
            // else => AccountForm
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(error.message);
            }
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
            navigate(`/create-account/${newId}`);
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
                <h3 className="fs-1 text-warning" >{id ? 'Edit' : 'Add'} Contact Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group as={Row} className="mb-3 p-3" controlId="name" >
                    <Form.Label column sm={2} className="fs-4" >Name:</Form.Label>
                    <Col sm={10} >
                        <Form.Control
                            className="pb-0"
                            size="lg"
                            type="text"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 p-3" controlId="email" >
                    <Form.Label column sm={2} className="fs-4" >Email:</Form.Label>
                    <Col sm={10} >
                        <Form.Control 
                            className="pb-0"
                            size="lg"
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 p-3" controlId="phone" >
                    <Form.Label column sm={2} className="fs-4" >Phone:</Form.Label>
                    <Col sm={10} >
                        <Form.Control 
                            className="pb-0"
                            size="lg"
                            type="tel"
                            name="phone"
                            value={customer.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Button className="w-100 fs-4" variant="outline-info" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal className="text-center" show={showSuccess} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-success" >Success</Modal.Title>
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