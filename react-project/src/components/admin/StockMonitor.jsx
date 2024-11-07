/*

- View and Manage Product Stock Levels (Bonus): Develop a component for viewing and managing the stock levels of each product in the catalog. Administrators should be able to see the current stock level and make adjustments as needed.
- Restock Products When Low (Bonus): Implement a component that monitors product stock levels and triggers restocking when they fall below a specified threshold. Ensure that stock replenishment is efficient and timely.

*/

import { useEffect, useState } from "react";
import { array, func } from 'prop-types';
import { Container, Badge, Button, Spinner, ListGroup, Modal } from "react-bootstrap";
import axios from "axios";
import { redirectDocument } from "react-router-dom";

function StockMonitor() {
    const [productsBelowThreshold, setProductsBelowThreshold] = useState([]);
    const [numProductsToStock, setNumProductsToStock] = useState(0);
    const [productDetails, setProductDetails] = useState({});
    const [products, setProducts] = useState([]);
    const [modalMessage, setModalMessage] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isRestocking, setIsRestocking] = useState(false);
    const [error, setError] = useState('');
    const threshold = 10;

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

    const fetchProductDetails = async () => {
        const belowThreshold = products.filter(product => product.product_stock <= threshold);
        console.log('Products below threshold:', belowThreshold)
        
        const details = {};
        
        await Promise.all(belowThreshold.map(async product => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/products/${product.product_id}`);
                const detailsData = response.data;
                // console.log(detailsData);
                const productStock = product.product_stock;
                
                details[detailsData.id.toString()] = {
                    id: detailsData.id,
                    name: detailsData.name,
                    stock: productStock,
                };
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError(error);
            }
        }));
        
        setProductsBelowThreshold(Object.values(details));
        console.log(productsBelowThreshold)
        setNumProductsToStock(belowThreshold.length);
    };
    
    const handleRestock = async () => {
        setShowAlert(false);
        setIsRestocking(true);
        setModalMessage([]);
        const messages = [];
        
        try {
            console.log("Restocking products:", productsBelowThreshold);
            const response = await axios.post(`http://127.0.0.1:5000/stock-monitor`);
            const messageData = response.data;
            console.log(messageData);
            
            // messages.push(messageData['message']);
            if (messageData['Products Below Threshold'].length === 0) {
                messages.push("No products below threshold to restock.");
            }

            messages.push(messageData['message'], messageData['Restocking Details']);
            console.log(messageData);

            setModalMessage(messages);
            setShowMessage(true);
            setProductsBelowThreshold([]);
            handleUpdateProducts(messages);
        } catch (error) {
            console.error('Error restocking products:', error.response ? error.response.data : error.message);
            setError('Error restocking products');
        } finally {
            setIsRestocking(false);
        }
    };

    const handleUpdateProducts = (stockData) => {
        stockData['Restocking Details'].map(stock => {
            if (stock.product_id === products.product_id) {

                setProducts(prevProducts => ([
                    ...prevProducts,
                    {[stock.product_id]: {
                        product_id: products.product_id,
                        product_stock: stock.new_stock_quantity,
                        last_restock_date: stock.last_restock_date,
                    }}
                ]))
            }
        })
    }
    
    const handleReload = async () => {
        setShowMessage(false);
        try {
            await fetchProductDetails();

        } catch (error) {
            console.error('Error fetching product details:', error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchCatalog();
    }, []);

    useEffect(() => {
        
        fetchProductDetails();
    }, [products]);
    
    if (isRestocking) {
        return (
            <p>
                Restocking  
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </p>
        )
    };

    return (
        <Container className="pt-4">
            <h3 className="pb-2" >Stock Monitor</h3>
            <div>
                <Badge as={Button} onClick={() => setShowAlert(true)} pill bg="warning" text="dark" className="stock-badge fw-bold fs-6">{numProductsToStock} Products Low</Badge>
            </div>

            <Modal className='text-center' show={showAlert} onHide={() => setShowAlert(false)} backdrop='static' keyboard={false} >
                <Modal.Header className="bg-warning-subtle">
                    <Modal.Title className='text-warning-emphasis fw-bold' >Low Stock Levels!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-warning-emphasis bg-warning-subtle">
                    Products currently below the stock threshold:
                    <ListGroup>
                        {productsBelowThreshold && productsBelowThreshold.length > 0 ? (
                            productsBelowThreshold.map(product => (
                                <ListGroup.Item key={product.id}>
                                    {product.name} - Current Stock: {product.stock}
                                </ListGroup.Item>
                                ))
                        ) : (
                            <div>No products below threshold.</div>
                        )}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer className="bg-warning-subtle">
                    {productsBelowThreshold && productsBelowThreshold.length > 0 ? (
                        <Button variant="outline-primary" onClick={handleRestock} >Restock All</Button>
                    ) : (
                        <Button variant="outline-secondary" onClick={() => setShowAlert(false)} >Close</Button>
                    )}
                </Modal.Footer>
            </Modal>
            
            <Modal className='text-center' show={showMessage} onHide={() => setShowMessage(false)} backdrop='static' keyboard={false}>
                <Modal.Header>
                    <Modal.Title className='text-success' >Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Restock statuses are listed below!
                    <ListGroup>
                        {modalMessage.map((message, index) => (
                            <ListGroup.Item key={index} >{message}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleReload} >Done</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StockMonitor;

// StockMonitor.propTypes = {
//     products: array,
//     setProducts: func
// }