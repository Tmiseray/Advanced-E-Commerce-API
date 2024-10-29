/*
- Place Order Form: Create a form component for customers to place new orders, specifying the products they wish to purchase and providing essential order details. Each order should capture the order date and the associated customer.


*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function OrderForm() {
    const [orderDetails, setOrderDetails] = useState([{ 
        productId: '',
        productName: ''
     }]);
    const [errors, setErrors] = useState([{}]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { customerId, orderId } = useParams();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (id) {
    //         axios.get(`http://127.0.0.1:5000/products/${id}`)
    //             .then(response => {
    //                 setAccount(response.data);
    //             })
    //             .catch(error => setErrorMessage(error.message));
    //     }
    // }, [id]);

    const handleAddInputs = () => {
        setOrderDetails([...orderDetails, { productId: '', productName: '' }]);
    };

    const handleChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...orderDetails];
        onChangeValue[index][name] = value;
        setOrderDetails(onChangeValue);
    };

    const handleDeleteInput = (index) => {
        const newDetails = [...orderDetails];
        newDetails.splice(index, 1);
        setOrderDetails(newDetails);
    }

    const validateForm = () => {
        let errors = [{}];
        if (!orderDetails.productId && !orderDetails.productName) errors.index = 'Either Product ID or Name is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (orderId) {
                await axios.put(`http://127.0.0.1:5000/orders/${orderId}`, orderDetails);
            } else {
                await axios.post(`http://127.0.0.1:5000/place-order/?customer_id=${customerId}`, orderDetails);
            }
            setShowSuccess(true);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };


    const handleClose = () => {
        setShowSuccess(false);
        setOrderDetails([{ productId: '', productName: '' }]);
        setSubmitting(false);
        navigate(`/orders/${orderId}`);
    };

    if (isSubmitting) return 
        <p>
            Submitting order 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container>
            <Form onSubmit={handleSubmit} >
                <h3>{id ? 'Edit' : 'Add'} Order Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                {orderDetails.map((item, index) => (
                    <div className="detailsContainer" key={index} >
                        <Form.Group controlId="productId" >
                            <Form.Label>Product ID:</Form.Label>
                            <Form.Control 
                                type="number"
                                name="productId"
                                value={item.productId}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors.index}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.index}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="productName" >
                            <Form.Label>Product Name:</Form.Label>
                            <Form.Control 
                                type="text"
                                name="productName"
                                value={item.productName}
                                onChange={(event) => handleChange(event, index)}
                                isInvalid={!!errors.index}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.index}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {orderDetails.length > 1 && (
                            <Button variant="outline-danger" onClick={() => handleDeleteInput(index)} >Delete</Button>
                        )}
                        {index === orderDetails.length - 1 && (
                            <Button variant="outline-success" onClick={() => handleAddInputs()} >Add</Button>
                        )}
                    </div>
                ))}

                <div className="body" >{JSON.stringify(orderDetails)} </div>

                <Button variant="primary" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal show={showSuccess} onHide={handleClose} centered >
                <Modal.Header>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Order information has been successfully {orderId ? 'updated' : 'submitted'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} >
                        View Order Details
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderForm;