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
    const [deactivateMessage, setDeactivateMessage] = useState('');
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const [activeCatalogKey, setActiveCatalogKey] = useState(null);
    const [currentVariant, setCurrentVariant] = useState('outline-primary');
    const variantList = ['outline-primary', 'outline-info'];
    const [currentColor, setCurrentColor] = useState('info-subtle');
    const colorList = ['info-subtle', 'primary-subtle'];
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCatalog = async () => {
        setError('');
    
        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
        }, timeoutDuration);
    
        try {
            const response = await axios.get('http://127.0.0.1:5000/catalog');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products:', error)
        } finally {
            clearTimeout(timeoutId);
        }
    };
    
    const fetchDetails = async (id) => {
        setIsFetchingDetails(true);
        setError('');
    
        const timeoutDuration = 5000;
        const timeoutId = setTimeout(() => {
        }, timeoutDuration);
    
        try {
            const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
            setDetails(response.data);
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

    const toggleDetails = (id, variant, color) => {
        if (details && details.id === id) {
            setDetails([]);
            setActiveCatalogKey(null);
        } else {
            fetchDetails(id);
            setCurrentVariant(variant);
            setCurrentColor(color);
            setActiveCatalogKey(id);
        }
    };

    useEffect(() => {
        fetchCatalog();
    }, []);

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
            <h2>Catalog Stock</h2>
                <Row className="fs-5 text-decoration-underline text-info mb-2">
                    <Col colspan={2}>Product Id</Col>
                    <Col colspan={3}>Total Stock</Col>
                    <Col colspan={7}>Last Restock Date</Col>
                </Row>
                <Container>
                    {products.map((product, index) => {
                        const variant = variantList[index % variantList.length];
                        const color = colorList[index % colorList.length];
                        return (
                            <Accordion activeKey={activeCatalogKey}>
                                <Card key={product.product_id} bg={color} >
                                    <Accordion.Header eventKey={product.product_id}>
                                        <Row className="w-100" as={Button} variant={variant} onClick={() => toggleDetails(product.product_id, variant, color)} >
                                            <Col colspan={2}>{product.product_id}</Col>
                                            <Col colspan={3}>{product.product_stock}</Col>
                                            <Col colspan={7}>{product.last_restock_date}</Col>
                                        </Row>
                                    </Accordion.Header>
                                    <Accordion.Collapse eventKey={product.product_id} >
                                        <Card.Body>
                                            <Col as={Button} variant='outline-success' onClick={() => handleUpdateStock(details.id)} colspan={2}>Update Stock</Col>
                                            <Col colspan={4}>{details.name}</Col>
                                            <Col colspan={2}>${details.price}</Col>
                                            <Col as={Button} variant='outline-warning' onClick={() => handleEditProduct(details.id)} colspan={2}>Edit Details</Col>
                                            <Col as={Button} variant='outline-danger' onClick={() => handleDeactivation(details.id)} colspan={2}>Deactivate</Col>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            )
                        })}
                </Container>

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



/*

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
                                    {details && details.id === product.product_id ? 'Hide Details' : 'Show Details'}
                                </ListGroup.Item>
                                <ListGroup.Item action variant='success' onClick={() => handleUpdateStock(product.product_id)} >Update Stock</ListGroup.Item>
                            </ListGroup>
                            {details.id === product.product_id && (
                                <ListGroup horizontal>
                                    <ListGroup.Item action variant='transparent' >  </ListGroup.Item>
                                    <ListGroup.Item action variant={currentVariant}> {details.name} </ListGroup.Item>
                                    <ListGroup.Item action variant={currentVariant}>Price: ${details.price} </ListGroup.Item>
                                    <ListGroup.Item action variant='warning' onClick={() => handleEditProduct(expandedDetails.id)}>Edit Details</ListGroup.Item>
                                    <ListGroup.Item action variant='danger' onClick={() => handleDeactivation(expandedDetails.id)}>Deactivate Product</ListGroup.Item>
                                </ListGroup>
                            )}

                        </div>
                    )}
                )}

*/