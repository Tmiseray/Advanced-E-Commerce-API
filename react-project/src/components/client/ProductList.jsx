/*
- List Products: Create a component to display a list of all available products in the e-commerce platform, providing essential product information.

*/

import axios from 'axios';
import { array, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Spinner } from "react-bootstrap";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const { customerId } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const variantList = ['primary', 'info'];


    const fetchProducts = async () => {
        setIsFetching(true);
        setError('');

        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
            setFetch(false);
        }, timeoutDuration);

        try {
            const response = await axios.get('http://127.0.0.1:5000/products/active-products');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products:', error)
        } finally {
            clearTimeout(timeoutId);
            setIsFetching(false);
        }
    };

    const handleClose = () => {
        setShowRedirect(false);
        if (customerId) {
            navigate('/place-order');
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (isFetching) return 
        <p>
            Fetching Products 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container>
            <h2 className='text-warning mb-5 h1' >Products</h2>
                {error && <p className="text-danger">{error}</p>}
                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    products.map((product, index) => {
                        const currentVariant = variantList[index % variantList.length];
                        return (
                        <ListGroup key={product.id} horizontal onClick={() => setShowRedirect(true)} >
                            <ListGroup.Item action variant={currentVariant}>ID: {product.id} </ListGroup.Item>
                            <ListGroup.Item action variant={currentVariant}>{product.name} </ListGroup.Item>
                            <ListGroup.Item action variant={currentVariant}> ${product.price} </ListGroup.Item>
                        </ListGroup>
                        );
                    })
                )}

            <Modal show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirect</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to {customerId ? 'place an order' : 'login'} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={() => setShowRedirect(false)} >
                        Back to Products
                    </Button>
                    <Button variant='outline-primary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductList;