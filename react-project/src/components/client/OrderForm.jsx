/*
- Place Order Form: Create a form component for customers to place new orders, specifying the products they wish to purchase and providing essential order details. Each order should capture the order date and the associated customer.


*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function OrderForm() {
    const [order, setOrder] = useState([]);
    const [order_items, setOrderItems] = useState([{
        product_id: '',
        product_name: '',
        quantity: '',
        price_per_unit: ''
    }])
    const [errors, setErrors] = useState([{}]);
    const [isFetchingOrder, setIsFetchingOrder] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { customer_id, order_id } = useParams();
    const navigate = useNavigate();
    const variantList = ['primary', 'info'];

    useEffect(() => {
        if (order_id) {
            axios.get(`http://127.0.0.1:5000/orders/${order_id}`)
                .then(response => {
                    setOrder(response.data);
                    setOrderItems(order.order_details);
                })
                .catch(error => setErrorMessage(error.message));
        }
    }, [order_id]);

    const handleAddInputs = () => {
        setOrderItems([...order_items, { product_id: '', product_name: '', quantity: '', price_per_unit: '' }]);
    };

    const handleChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...order_items];
        onChangeValue[index][name] = value;
        setOrderItems(onChangeValue);
    };

    const handleDeleteInput = (index) => {
        const newItems = [...order_items];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    }

    const validateForm = () => {
        let errors = [{}];
        if (!order_items.product_id && !order_items.product_name) errors.index = 'Either Product ID or Name is required';
        if (order_items.quantity === '' ) errors.index = 'Quantity is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (order_id) {
                await axios.put(`http://127.0.0.1:5000/orders/${order_id}`, order_items);
            } else {
                await axios.post(`http://127.0.0.1:5000/place-order/?customer_id=${customer_id}`, order_items);
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
        setOrderDetails([{ 
            product_id: '',
            product_name: '',
            quantity: '',
            price_per_unit: ''
         }]);
        setSubmitting(false);
        navigate(`/orders/${order_id}`);
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

            <Modal show={showSuccess} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Order information has been successfully {order_id ? 'updated' : 'submitted'}!
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