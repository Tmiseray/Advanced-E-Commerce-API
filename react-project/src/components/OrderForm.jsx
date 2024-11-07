/*
- Place Order Form: Create a form component for customers to place new orders, specifying the products they wish to purchase and providing essential order details. Each order should capture the order date and the associated customer.


*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Modal, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

function OrderForm() {
    const [order, setOrder] = useState([]);
    const [orderDetails, setOrderDetails] = useState([{
        product_id: '',
        product_name: '',
        quantity: '',
        price_per_unit: ''
    }])
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [customerId, setCustomerId] = useState('');
    const { order_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (order_id) {
            axios.get(`http://127.0.0.1:5000/orders/${order_id}`)
                .then(response => {
                    setOrder(response.data);
                    setOrderDetails(order.order_details);
                })
                .catch(error => setErrorMessage(error.message));
            }
        getStorageItems();
    }, [order_id]);

    const getStorageItems = () => {
        const storedId = JSON.parse(sessionStorage.getItem('id'));
        setCustomerId(storedId);
    };

    const handleAddInputs = () => {
        const updatedDetails = [...orderDetails, { product_id: '', product_name: '', quantity: '', price_per_unit: '' }]
        setOrderDetails(updatedDetails);
    };

    const handleChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...orderDetails];
        onChangeValue[index][name] = value || '';
        setOrderDetails(onChangeValue);
    };

    const handleDeleteInput = (index) => {
        const newItems = [...orderDetails];
        newItems.splice(index, 1);
        setOrderDetails(newItems);
    }

    const validateForm = () => {
        let errors = [];
    
        orderDetails.forEach((item, index) => {
            if (!item.product_id && !item.product_name) {
                errors[index] = errors[index] || {};
                errors[index].product = 'Product ID and Name are required';
            }
            if (!item.quantity) {
                errors[index] = errors[index] || {};
                errors[index].quantity = 'Quantity is required';
            }
        });
    
        setErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        console.log('Submit clicked');
        console.log("Submitting order with customerId:", customerId);
        console.log("Sending order details:", orderDetails); 

        if (!validateForm()) return;

        const formattedOrderDetails = orderDetails.map(item => ({
            product_id: item.product_id || null,
            product_name: item.product_name || null,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit || null,
        }))

        console.log(formattedOrderDetails)

        try {
            if (order_id) {
                await axios.put(`http://127.0.0.1:5000/orders/${order_id}`, { order_details: formattedOrderDetails});
            } else {
                await axios.post(`http://127.0.0.1:5000/place-order/?customer_id=${customerId}`, { order_details: formattedOrderDetails});
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
        navigate(`/orders/details/${order_id}`);
    };

    if (isSubmitting) return 
        <div>
            Submitting order 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </div>;

    return (
        <Container>
            <Form className="orderForm p-4 mt-3 rounded" onSubmit={handleSubmit} >
                <h3 className="fs-1">{order_id ? 'Edit' : 'Add'} Order Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                {orderDetails.map((item, index) => (
                    <div key={index} >
                        <Form.Group as={Row} className="mb-3 p-3" controlId={`quantity${index}`} >
                            <Form.Label column sm={3} className="fs-4" >Quantity:</Form.Label>
                            <Col sm={9} >
                                <Form.Control 
                                    className="pb-0"
                                    size="lg"
                                    type="text"
                                    name="quantity"
                                    value={item[index].quantity || ''}
                                    onChange={(event) => handleChange(event, index)}
                                    isInvalid={!!errors.index}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.index}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 p-3" controlId={`productId${index}`} >
                            <Form.Label column sm={3} className="fs-4" >Product ID:</Form.Label>
                            <Col sm={9} >
                                <Form.Control 
                                    className="pb-0"
                                    size="lg"
                                    type="number"
                                    name="productId"
                                    value={item[index].productId || ''}
                                    onChange={(event) => handleChange(event, index)}
                                    isInvalid={!!errors.index}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.index}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 p-3" controlId={`productName${index}`} >
                            <Form.Label column sm={3} className="fs-4" >Product Name:</Form.Label>
                            <Col sm={9} >
                                <Form.Control 
                                    className="pb-0"
                                    size="lg"
                                    type="text"
                                    name="productName"
                                    value={item[index].productName || ''}
                                    onChange={(event) => handleChange(event, index)}
                                    isInvalid={!!errors.index}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.index}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        {orderDetails.length > 1 ? (
                            <>
                            <Button className="w-50 fs-4" variant="outline-success" onClick={() => handleAddInputs()} >Add Another Product</Button>
                            <Button className="w-50 fs-4" variant="outline-danger" onClick={() => handleDeleteInput(index)} >Delete Product</Button>
                            </>
                        ):(
                            <Button className="w-50 fs-4" variant="outline-success" onClick={() => handleAddInputs()} >Add Another Product</Button>
                        )}
                    </div>
                ))}

                <Button className="w-100 fs-4 mt-5" variant="outline-info" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal className="text-center" show={showSuccess} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-success">Success</Modal.Title>
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