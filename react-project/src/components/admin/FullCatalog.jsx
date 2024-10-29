/*

- Read Product Details: Create a component to display product details retrieved from the backend based on the product's unique identifier (ID).
    - Update Product Form: Build a form component that allows users to update product details, including the product name and price.
    - Delete Product Information: Build a function in your Product Detail Component that when triggered will delete a product from the backend based on their unique identifier (ID).

- Product Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a product from the system based on its unique ID

*/

import axios from 'axios';
import { array, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Spinner } from "react-bootstrap";

function FullCatalog() {
    const [products, setProducts] = useState([]);
    const [details, setDetails] = useState([]);
    const [isFetchingCatalog, setFetchCatalog] = useState(false);
    const [isFetchingDetails, setFetchDetails] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const { productId } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setFetchCatalog(true);
        setError(null);

        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
            setFetchCatalog(false);
        }, timeoutDuration);

        try {
            const response = await axios.get('http://127.0.0.1:5000/catalog');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products:', error)
        } finally {
            clearTimeout(timeoutId);
            setFetchCatalog(false);
        }
    };

    const fetchDetails = async (productId) => {
        setFetchDetails(true);
        setError(null);

        const timeoutDuration = 5000;
        const timeoutId = setTimeout(() => {
            setFetchDetails(false);
        }, timeoutDuration);

        try {
            const response = await axios.get(`http://127.0.0.1:5000/products/${productId}`);
            setDetails(response.data);
        } catch (error) {
            setError('Error fetching product details:', error)
        } finally {
            clearTimeout(timeoutId);
            setFetchDetails(false);
        }
    };

    const showDetails = (productId) => {
        fetchDetails(productId);
        return (
            <>
                {details.map(detail => (
                    <ListGroup horizontal >
                        <ListGroup.Item variant='primary' > </ListGroup.Item>
                        <ListGroup.Item action variant='info' >{detail.name} </ListGroup.Item>
                        <ListGroup.Item action variant='success' > ${detail.price} </ListGroup.Item>

                    </ListGroup>
                ))}
            </>
        );
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (isFetchingCatalog) return 
        <p>
            Fetching Products in Catalog 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    if (isFetchingDetails) return 
        <p>
            Fetching Product Details 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container>
            <h3>Full Catalog</h3>
                {products.map(product => (
                    <ListGroup key={product.id} horizontal >
                        <ListGroup.Item action variant='primary'>ID: {product.id} </ListGroup.Item>
                        <ListGroup.Item action variant='info'>Stock Total: {product.product_stock} </ListGroup.Item>
                        <ListGroup.Item action variant='warning'>Last Restock Date: {product.last_restock_date} </ListGroup.Item>
                        <ListGroup.Item action variant='light' onClick={showDetails(product.id)} >Show Details</ListGroup.Item>
                        <ListGroup.Item action variant='secondary' onClick={navigate(`/catalog/update-stock/specified-product/?product_id=${product.id}`)} >Update Stock</ListGroup.Item>
                    </ListGroup>
                ))}

            <Modal show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirect</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to {customerId ? 'place an order' : 'login'} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={setShowRedirect(false)} >
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

export default FullCatalog;