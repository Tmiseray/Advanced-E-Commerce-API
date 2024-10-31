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
    // const [details, setDetails] = useState([]);
    const [deactivateMessage, setDeactivateMessage] = useState('');
    const [isFetchingCatalog, setIsFetchingCatalog] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const [expandedDetails, setExpandedDetails] = useState([]);
    const [currentVariant, setCurrentVariant] = useState('primary');
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const variantList = ['primary', 'info'];


    const fetchCatalog = async () => {
        setIsFetchingCatalog(true);
        setError('');

        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
            setIsFetchingCatalog(false);
        }, timeoutDuration);

        try {
            const response = await axios.get('http://127.0.0.1:5000/catalog');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products:', error)
        } finally {
            clearTimeout(timeoutId);
            setIsFetchingCatalog(false);
        }
    };

    const fetchDetails = async (id) => {
        setIsFetchingDetails(true);
        setError('');

        const timeoutDuration = 5000;
        const timeoutId = setTimeout(() => {
            setIsFetchingDetails(false);
        }, timeoutDuration);

        try {
            const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
            setExpandedDetails(response.data);
        } catch (error) {
            setError('Error fetching product details:', error);
        } finally {
            clearTimeout(timeoutId);
            setIsFetchingDetails(false);
        }
    };

    const handleClose = () => {
        if (isDeactivating) {
            setIsDeactivating(false);
        }
        setShowRedirect(false);
    };

    const handleEditProduct = (id) => {
        setShowRedirect(true);
        navigate(`/products/${id}`);
    };

    const handleUpdateStock = (id) => {
        setShowRedirect(true);
        navigate(`/catalog/update-stock/${id}`);
    };

    const handleDeactivation = async (id) => {
        setIsDeactivating(true);
        setError('');

        try {
            const response = await axios.put(`http://127.0.0.1:5000/products/deactivate/${id}`);
            setDeactivateMessage(response.data);
        } catch (error) {
            setError('Error deactivating product:', error);
        } finally {
            setIsDeactivating(false);
        }
    };

    const toggleDetails = (id, variant) => {
        if (expandedDetails && expandedDetails.id === id) {
            setExpandedDetails([]);
        } else {
            fetchDetails(id);
            setCurrentVariant(variant);
        }
    };

    useEffect(() => {
        fetchCatalog();
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

    if (isDeactivating) return
        <Modal onHide={handleClose} backdrop='static' keyboard={false} centered >
            <Modal.Header>
                <Modal.Title>Deactivation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Deactivating Product 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-secondary' onClick={handleClose} >
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>;

    return (
        <Container>
            <h3 className='fs-1 text-warning'>Full Catalog</h3>
                {error && <p className='text-danger'>{error}</p>}
                {products.map((product, index) => {
                    const variant = variantList[index % variantList.length];
                    return (
                        <div key={product.product_id} >
                            <ListGroup horizontal >
                                <ListGroup.Item action variant={variant}>ID: {product.product_id} </ListGroup.Item>
                                <ListGroup.Item action variant={variant}>Stock Total: {product.product_stock} </ListGroup.Item>
                                <ListGroup.Item action variant={variant}>Last Restock Date: <br /> {product.last_restock_date} </ListGroup.Item>
                                <ListGroup.Item action variant='secondary' onClick={() => toggleDetails(product.product_id, variant)} >
                                    {expandedDetails && expandedDetails.id === product.product_id ? 'Hide Details' : 'Show Details'}
                                </ListGroup.Item>
                                <ListGroup.Item action variant='success' onClick={() => handleUpdateStock(product.product_id)} >Update Stock</ListGroup.Item>
                            </ListGroup>
                            {expandedDetails.id === product.product_id && (
                                <ListGroup horizontal>
                                    <ListGroup.Item action variant='transparent' >  </ListGroup.Item>
                                    <ListGroup.Item action variant={currentVariant}> {expandedDetails.name} </ListGroup.Item>
                                    <ListGroup.Item action variant={currentVariant}>Price: ${expandedDetails.price} </ListGroup.Item>
                                    <ListGroup.Item action variant='warning' onClick={() => handleEditProduct(expandedDetails.id)}>Edit Details</ListGroup.Item>
                                    <ListGroup.Item action variant='danger' onClick={() => handleDeactivation(expandedDetails.id)}>Deactivate Product</ListGroup.Item>
                                </ListGroup>
                            )}

                        </div>
                    )}
                )}

            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to update Product ID: {products.id} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={handleClose} >
                        Back to Catalog
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