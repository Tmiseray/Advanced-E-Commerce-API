/*

- View and Manage Product Stock Levels (Bonus): Develop a component for viewing and managing the stock levels of each product in the catalog. Administrators should be able to see the current stock level and make adjustments as needed.
- Restock Products When Low (Bonus): Implement a component that monitors product stock levels and triggers restocking when they fall below a specified threshold. Ensure that stock replenishment is efficient and timely.

*/

import { useEffect, useRef, useState } from "react";
import { Container, Badge, Overlay, Popover, Button, Spinner, ListGroup, Modal } from "react-bootstrap";
import axios from "axios";

function StockMonitor({products}) {
    const [productsBelowThreshold, setProductsBelowThreshold] = useState([]);
    const [numProductsToStock, setNumProductsToStock] = useState(0);
    const [modalMessage, setModalMessage] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [isRestocking, setIsRestocking] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [error, setError] = useState('');
    const targetRef = useRef(null);
    const threshold = 10;


    useEffect(() => {
        const fetchProductDetails = async () => {
            const belowThreshold = products.filter(product => product.product_stock <= threshold);
            console.log('Products below threshold:', belowThreshold)
            
        
        // Fetch product details for those below the threshold
            const detailsPromises = belowThreshold.map(async product => {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/products/${product.product_id}`);
                    return response.data; // Assuming this returns the full product details
                } catch (error) {
                    console.error('Error fetching product details:', error);
                    setError(error);
                }
            });

            const details = await Promise.all(detailsPromises);
            const filteredDetails = details.filter(detail => detail)
            setProductsBelowThreshold(filteredDetails); // Filter out any null responses
            setNumProductsToStock(filteredDetails.length);
        };
        fetchProductDetails();
    }, [products]);

    const handleRestock = async (event) => {
        event.preventDefault();
        setIsRestocking(true);
        try {
            // Logic to update stock in the database
            // Loop through productsBelowThreshold to perform updates
            console.log("Restocking products:", productsBelowThreshold);
            // Example API call to update stock for each product
            // await axios.put('http://127.0.0.1:5000/restock', { products: productsBelowThreshold });
            productsBelowThreshold.map(async product => {
                try {
                    const response = await axios.post(`http://127.0.0.1:5000/catalog/update-stock/${product.id}`);
                    const messageData = response.data;
                    console.log(messageData);

                    setModalMessage(prev => ([
                        ...prev, 
                        messageData.message,
                    ]))
                } catch (error) {
                    setError(error);
                }
            })
            setShowMessage(true);
        } catch (error) {
            setError('Error restocking products:', error);
        } finally {
            setIsRestocking(false);
        }
    };

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Products Below Threshold</Popover.Header>
            <Popover.Body>
                {productsBelowThreshold.length > 0? (
                    productsBelowThreshold.map(product => (
                        <div key={product.product_id}>{product.name}</div>
                        ))
                ) : (
                    <div>No products below threshold.</div>
                )}
            </Popover.Body>
            <Popover.Footer>
                <Button onClick={() => handleRestock()} disabled={numProductsToStock === 0} >Restock All</Button>
            </Popover.Footer>
        </Popover>
    );

    if (isRestocking) return
        <p>
            Restocking  
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container className="pt-4">
            <h3 className="pb-2" >Stock Monitor</h3>
            <div ref={targetRef}>
                <Badge as={Button} pill bg="warning" text="dark" className="stock-badge fw-bold fs-6">{numProductsToStock} Products Low</Badge>
            </div>
            <Overlay target={targetRef.current} placement="right" show={showOverlay} onHide={() => setShowOverlay(false)}>
                {popover}
            </Overlay>
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
                    <Button variant="outline-secondary" onClick={() => setShowMessage(false)} >Done</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StockMonitor;