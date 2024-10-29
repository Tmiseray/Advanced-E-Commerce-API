/*
- Create Product Form: Develop a form component for adding a new product to the e-commerce database. Capture essential product details, such as the product name and price.
- Update Product Form: Build a form component that allows users to update product details, including the product name and price.
- Product Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a product from the system based on its unique ID

*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { object, func } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import axios from "axios";

function ProductForm() {
    const [product, setProduct] = useState({ 
        name: '',
        price: ''
     });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/products/${id}`)
                .then(response => {
                    setAccount(response.data);
                })
                .catch(error => setErrorMessage(error.message));
        }
    }, [id]);

    const validateForm = () => {
        let errors = {};
        if (!product.name) errors.name = 'Product name is required';
        if (!product.price || product.price <= 0 ) errors.price = 'Product price must be a positive number';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/products/${id}`, product);
            } else {
                await axios.post('http://127.0.0.1:5000/products', product);
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
        setProduct(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShowSuccess(false);
        setAccount({ name: '', price: '' });
        setSubmitting(false);
        if (id) {
            navigate(`/catalog`);
        } else {
            navigate('/products');
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
                <h3>{id ? 'Edit' : 'Add'} Product Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group controlId="productName" >
                    <Form.Label>Product Name:</Form.Label>
                    <Form.Control 
                        type="text"
                        name="productName"
                        value={product.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="productPrice" >
                    <Form.Label>Price:</Form.Label>
                    <Form.Control 
                        type="number"
                        name="productPrice"
                        value={customer.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.price}
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
                    Product information has been successfully {id ? 'updated' : 'added'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} >
                        {id ? 'Continue to Catalog' : 'Add Another Product'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductForm;