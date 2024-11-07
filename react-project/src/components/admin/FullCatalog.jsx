/*

- Read Product Details: Create a component to display product details retrieved from the backend based on the product's unique identifier (ID).
    - Update Product Form: Build a form component that allows users to update product details, including the product name and price.
    - Delete Product Information: Build a function in your Product Detail Component that when triggered will delete a product from the backend based on their unique identifier (ID).

- Product Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a product from the system based on its unique ID

*/

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Modal, Spinner, Row, Col, Accordion, Card } from "react-bootstrap";

function FullCatalog() {
    const [products, setProducts] = useState([]);
    const [details, setDetails] = useState({});
    const [deactivateMessage, setDeactivateMessage] = useState('');
    const [activateMessage, setActivateMessage] = useState('');
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const [activeCatalogKey, setActiveCatalogKey] = useState(null);
    const [currentColor, setCurrentColor] = useState('text-info');
    const colorList = ['text-info', 'text-primary-emphasis'];
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
            const detailsData = response.data;
            console.log(detailsData);

            setDetails(prev => ({
                ...prev, 
                [detailsData.id]: {
                    id: detailsData.id,
                    name: detailsData.name,
                    price: detailsData.price,
                    active: (detailsData.is_active ? 'Active' : 'Inactive'),
                }
            }))
            console.log(details)
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
        } else if (isActivating) {
            setIsActivating(false);
        }
        setShowRedirect(false);
    };

    const handleEditProduct = (id) => {
        setShowRedirect(true);
        navigate(`/products/${id}`);
    };

    const handleDeactivation = async (id) => {
        setIsDeactivating(true);
        setError('');

        try {
            const response = await axios.put(`http://127.0.0.1:5000/products/deactivate/${id}`);
            setDeactivateMessage(response.data);
            setDetails(details[id].active === 'Inactive');
        } catch (error) {
            setError('Error deactivating product:', error);
        } finally {
            setIsDeactivating(false);
        }
    };

    const handleActivation = async (id) => {
        setIsActivating(true);
        setError('');

        try {
            const response = await axios.put(`http://127.0.0.1:5000/products/activate/${id}`);
            setActivateMessage(response.data);
            setDetails(details[id].active === 'Active');
        } catch (error) {
            setError('Error activating product:', error.message);
        } finally {
            setIsActivating(false);
        }
    };

    const toggleDetails = (id, color) => {
        if (details[id]) {
            setActiveCatalogKey(null);
        } else {
            fetchDetails(id);
            setCurrentColor(color);
            setActiveCatalogKey(id);
        }
    };

    useEffect(() => {
        fetchCatalog();
    }, [products]);

    useEffect(() => {
        console.log('Details State updated:', details);
    }, [details]);

    if (isFetchingDetails) {
        return (
            <p>
                Fetching Product Details 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </p>
        )
    };

    if (isDeactivating) {
        return (
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
            </Modal>
        )
    };

    if (isActivating) {
        return (
            <Modal onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Activation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Activating Product 
                    <Spinner animation="grow" size="sm" /> 
                    <Spinner animation="grow" size="sm" /> 
                    <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    };

    return (
        <Container className="catalogCol mt-3 p-3 mb-5 bg-secondary-subtle rounded">
            <h2>Catalog Stock</h2>
                <Row className="fs-5 text-center text-decoration-underline ps-3 pe-5  text-secondary-emphasis mb-2">
                    <Col colSpan={4}>Product Id</Col>
                    <Col colSpan={3}>Stock</Col>
                    <Col colSpan={5}>Restock</Col>
                </Row>
                <Accordion className='border border-primary rounded' defaultActiveKey={'0'}>
                    {products.map((product, index) => {
                        const color = colorList[index % colorList.length];
                        return (
                            <Accordion.Item key={product.product_id} eventKey={product.product_id}>
                                <Accordion.Header onClick={() => toggleDetails(product.product_id, color)}>
                                    <Row className={`w-100 fs-5 text-center ${color}`}>
                                        <Col colSpan={4}>{product.product_id}</Col>
                                        <Col colSpan={3}>{product.product_stock}</Col>
                                        <Col colSpan={5}>{product.last_restock_date}</Col>
                                    </Row>
                                </Accordion.Header>
                                <Accordion.Body className="bg-body-tertiary text-center text-warning-emphasis fs-5" eventKey={product.product_id.toString()} >
                                    <Card.Body className='pb-2'>
                                        {details[product.product_id] && (
                                        <Row className='pb-3 fs-5 pt-2' >
                                            <Col colSpan={3}>{details[product.product_id].active}</Col>
                                            <Col colSpan={4}>${details[product.product_id].price}</Col>
                                            <Col colSpan={5}>{details[product.product_id].name}</Col>                                        
                                        </Row>
                                        )}
                                        <Card.Footer>
                                            <Row className='w-100'>
                                                <Col as={Button} variant='outline-warning' onClick={() => handleEditProduct(details[product.product_id].id)} >Edit Details</Col>
                                                {details[product.product_id] && details[product.product_id].active === 'Inactive' ? (
                                                    <>
                                                        <Col as={Button} variant='outline-danger' onClick={() => handleActivation(details[product.product_id].id)} >Activate</Col>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Col as={Button} variant='outline-danger' onClick={() => handleDeactivation(details[product.product_id].id)} >Deactivate</Col>
                                                    </>
                                                )}
                                            </Row>
                                        </Card.Footer>
                                    </Card.Body>
                                </Accordion.Body>
                            </Accordion.Item>
                            )
                        })}
                </Accordion>

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

