/*
- Create Product Form: Develop a form component for adding a new product to the e-commerce database. Capture essential product details, such as the product name and price.
- Update Product Form: Build a form component that allows users to update product details, including the product name and price.
- Product Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a product from the system based on its unique ID

*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Modal, Spinner, Row, Col } from "react-bootstrap";
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
                    setProduct(response.data);
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
                await axios.post('http://127.0.0.1:5000/add-product', product);
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

    const redirectCatalog = () => {
        setShowSuccess(false);
        navigate(`/catalog`);
    };

    const redirectAddProduct = () => {
        setShowSuccess(false);
        setProduct({ name: '', price: '' });
        navigate('/add-product');
    };

    // const handleClose = () => {
    //     setShowSuccess(false);
    //     setProduct({ name: '', price: '' });
    //     setSubmitting(false);
    //     if (id) {
    //         navigate(`/catalog`);
    //     } else {
    //         navigate('/add-product');
    //     }
    // };

    if (isSubmitting) {
        return  (
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
            <Form className="productForm p-4 mt-3" onSubmit={handleSubmit} >
                <h3 className="fs-1 text-warning" >{id ? 'Edit' : 'Add'} Product Information</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <Form.Group as={Row} className="mb-2 p-3" controlId="name" >
                    <Form.Label column sm={2} className="fs-4" >Product Name:</Form.Label>
                    <Col sm={10} >
                        <Form.Control 
                            className="pb-0"
                            size="lg"
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 p-3" controlId="price" >
                    <Form.Label column sm={2} className="fs-4" >Price: ($ 00.00)</Form.Label>
                    <Col sm={10} >
                        <Form.Control 
                            className="pb-0"
                            size="lg"
                            type="text"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Button className="w-100 fs-4" variant="outline-info" type="submit" disabled={isSubmitting} >
                    {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                </Button>
            </Form>

            <Modal className="text-center" show={showSuccess} onHide={() => setShowSuccess(false)} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-success">Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Product information has been successfully {id ? 'updated' : 'added'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={redirectAddProduct} >
                        Add A New Product
                    </Button>
                    <Button variant="outline-secondary" onClick={redirectCatalog} >
                        Continue to Catalog
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductForm;