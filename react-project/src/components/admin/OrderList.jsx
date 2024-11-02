/*

    - Cancel Order (Bonus): Implement an order cancellation feature, allowing customers to cancel an order if it hasn't been shipped or completed. Ensure that canceled orders are appropriately reflected in the system.

*/

import axios from 'axios';
import { array, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Spinner } from "react-bootstrap";


export const fetchOrders = async (setOrders, setError) => {
    setError('');

    const timeoutDuration = 10000;
    const timeoutId = setTimeout(() => {
    }, timeoutDuration);

    try {
        const response = await axios.get('http://127.0.0.1:5000/orders');
        setOrders(response.data);
        console.log(orders);
    } catch (error) {
        setError('Error fetching products:', error)
    } finally {
        clearTimeout(timeoutId);
    }
};

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [details, setDetails] = useState({});
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isFetchingOrders, setIsFetchingOrders] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const [currentVariant, setCurrentVariant] = useState('outline-primary');
    const variantList = ['outline-primary', 'outline-info'];
    const [currentColor, setCurrentColor] = useState('info-subtle');
    const colorList = ['info-subtle', 'primary-subtle'];
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleClose = () => {
        if (isDeleting) {
            setIsDeleting(false);
        }
        setShowRedirect(false);
    };

    const handleEditOrder = (id) => {
        setShowRedirect(true);
        navigate(`/orders/${id}`);
    };

    const handleDelete = async (id) => {
        setIsDeleting(true);
        setError('');

        try {
            const response = await axios.delete(`http://127.0.0.1:5000/orders/${id}`);
            setDeleteMessage(response.data);
        } catch (error) {
            setError('Error deleting order:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // const toggleDetails = (orderId, variant) => {
    //     setDetails(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    //     setCurrentVariant(variant);
    // };

    const trackingInformation = async (customerId, orderId) => {
        setError('');

        try {
            const response = await axios.post(`/orders/track-status/?customer_id=${customerId}&order_id=${orderId}`);
            const statusData = response.data;

            setTracking(prev => ({
                ...prev,
                [orderId]: {
                    status: statusData.status,
                    percent: getProgress(statusData.status),
                    variant: getVariant(statusData.status),
                }
            }));
        } catch (error) {
            setError('Error fetching tracking information:', error);
        }
    };

    const getProgress = (status) => {
        switch (status) {
            case "Order in process": return 25;
            case "Shipped": return 50;
            case "Out for delivery": return 75;
            case "Complete": return 100;
            default: return 0;
        }
    };

    const getVariant = (status) => {
        switch (status) {
            case "Order in process": return "warning";
            case "Shipped": return "success";
            case "Out for delivery": return "primary";
            case "Complete": return "info";
            default: return "secondary";
        }
    };

    const toggleProgressStatus = (customerId, orderId) => {
        if (tracking[orderId]) {
            setActiveOrdersKey(orderId); // If tracking info exists, show it
        } else {
            trackingInformation(customerId, orderId); // Fetch tracking info if not available
            setActiveOrdersKey(orderId);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    if (isFetchingDetails) return 
        <p>
            Fetching Order Details 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    if (isDeleting) return
        <Modal onHide={handleClose} backdrop='static' keyboard={false} centered >
            <Modal.Header>
                <Modal.Title>Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Deleting Order
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
            <h2>Orders</h2>
                <Row className="fs-5 text-decoration-underline text-info mb-2">
                        <Col colspan={1}>ID</Col>
                        <Col colspan={2}>C. ID</Col>
                        <Col colspan={3}>Order Date</Col>
                        <Col colspan={3}>Order Time</Col>
                        <Col colspan={3}>Total</Col>
                </Row>
                <Container>
                    {customerOrders.map((order) => {
                        const [ date, time ] = order.order_date_time.split('T');
                        return (
                            <Accordion activeKey={activeOrdersKey} >
                                <Card key={order.id} bg={currentColor} >
                                    <Accordion.Header eventKey={order.id}>
                                        <Button variant={currentVariant} onClick={() => toggleProgressStatus(order.customer_id, order.id)} >
                                            <Col colspan={1}>{order.id}</Col>
                                            <Col colspan={1}>{order.customer_id}</Col>
                                            <Col colspan={3}>{date}</Col>
                                            <Col colspan={3}>{time}</Col>
                                            <Col colspan={4}>${order.total_amount} </Col>
                                        </Button>
                                    </Accordion.Header>
                                    <Accordion.Collapse eventKey={order.id} >
                                        <Card.Body>
                                            <Row className="bg-black text-center text-warning" >
                                                <Col colspan={2}>{tracking[order.id]?.status || 'Loading...'}</Col>
                                                <Col colspan={10}>
                                                    <ProgressBar now={tracking[order.id]?.percent || 0} variant={tracking[order.id]?.variant || 'secondary'} animated />
                                                </Col>
                                            </Row>
                                            
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button variant="outline-light" onClick={() => handleOrderDetails(order.id)}>More Details</Button>
                                        </Card.Footer>
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
                    Redirecting you to edit Order ID: {orders.id} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={() => setShowRedirect(false)} >
                        Back to Orders
                    </Button>
                    <Button variant='outline-primary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderList;




// <h3 className='fs-1 text-warning'>Customers' Orders</h3>
//                 {error && <p className='text-danger'>{error}</p>}
//                 {orders.map((order, index) => {
//                     const variant = variantList[index % variantList.length];
//                     const [ date, time ] = order.order_date_time.split('T');
//                     return (
//                         <div key={order.id} >
//                             <ListGroup horizontal >
//                                 <ListGroup.Item action variant={variant}>ID: {order.id} </ListGroup.Item>
//                                 <ListGroup.Item action variant={variant}>Customer ID: {order.customer_id} </ListGroup.Item>
//                                 <ListGroup.Item action variant={variant}>Order Placed: <br /> {date} <br /> {time} </ListGroup.Item>
//                                 <ListGroup.Item action variant={variant}>Expected Delivery: {order.expected_delivery_date} </ListGroup.Item>
//                                 <ListGroup.Item action variant={variant}>Total Amount: {order.total_amount} </ListGroup.Item>
//                                 <ListGroup.Item action variant='secondary' onClick={() => toggleDetails(order.id, variant)} >
//                                     {details[order.id] ? 'Hide Details' : 'Show Details'}
//                                 </ListGroup.Item>
//                                 {/* <ListGroup.Item action variant='warning' onClick={() => handleEditOrder(order.id)}>Edit Order</ListGroup.Item>
//                                 <ListGroup.Item action variant='danger' onClick={() => handleDelete(order.id)}>Delete Order</ListGroup.Item> */}
//                             </ListGroup>
//                             {details[order.id] && order.order_details.map(detail => (
//                                 <ListGroup key={detail.product_id} horizontal>
//                                     <ListGroup.Item action variant='transparent' > </ListGroup.Item>
//                                     <ListGroup.Item action variant={currentVariant}>Quantity: {detail.quantity} </ListGroup.Item>
//                                     <ListGroup.Item action variant={currentVariant}>Product ID: {detail.product_id} </ListGroup.Item>
//                                     <ListGroup.Item action variant={currentVariant}>Product Name: {detail.product_name} </ListGroup.Item>
//                                     <ListGroup.Item action variant={currentVariant}>Price per Unit: ${detail.price_per_unit} </ListGroup.Item>
//                                 </ListGroup>
//                             ))}
//                             <ListGroup className='text-center' horizontal >
//                                 <ListGroup.Item action variant='warning' onClick={() => handleEditOrder(order.id)}>Edit Order</ListGroup.Item>
//                                 <ListGroup.Item action variant='danger' onClick={() => handleDelete(order.id)}>Delete Order</ListGroup.Item>
//                             </ListGroup>
//                         </div>
//                     )}
//                 )}