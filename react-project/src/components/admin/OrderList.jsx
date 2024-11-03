/*

    - Cancel Order (Bonus): Implement an order cancellation feature, allowing customers to cancel an order if it hasn't been shipped or completed. Ensure that canceled orders are appropriately reflected in the system.

*/

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Modal, Spinner, Row, Col, Accordion, Card, ProgressBar } from "react-bootstrap";


function OrderList() {
    const [orders, setOrders] = useState([]);
    const [tracking, setTracking] = useState({});
    const [activeOrdersKey, setActiveOrdersKey] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);
    const [currentColor, setCurrentColor] = useState('text-info');
    const colorList = ['text-info', 'text-primary-emphasis'];
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const fetchOrders = async () => {
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

    const handleClose = () => {
        if (isDeleting) {
            setIsDeleting(false);
        }
        setShowRedirect(false);
    };

    const handleDetails = (orderId) => {
        setShowRedirect(true);
        navigate(`/orders/details/${orderId}`);
    }

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

    const trackingInformation = async (customerId, orderId) => {
        setError('');

        try {
            const response = await axios.get(`http://127.0.0.1:5000/orders/track-status/?customer_id=${customerId}&order_id=${orderId}`);
            const statusData = response.data;
            console.log(response.data);

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

    const toggleProgressStatus = (customerId, orderId, color) => {
        console.log('Toggling Status for:', orderId);
        if (tracking[orderId]) {
            setActiveOrdersKey(null);
        } else {
            trackingInformation(customerId, orderId);
            setCurrentColor(color);
            setActiveOrdersKey(orderId);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        console.log("Tracking State updated", tracking);
    }, [tracking]);

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
                <Row className="fs-5 text-center ps-3 pe-5 text-decoration-underline text-secondary-emphasis">
                    <Col colSpan={1}>Order ID</Col>
                    <Col colSpan={1}>Cust. ID</Col>
                    <Col colSpan={7}>Date/Time</Col>
                    <Col colSpan={3}>Total</Col>
                </Row>
                <Accordion className='border border-primary rounded' defaultActiveKey={'0'}>
                    {orders.map((order, index) => {
                        const [ date, time ] = order.order_date_time.split('T');
                        const color = colorList[index % colorList.length];
                        return (
                            <Accordion.Item eventKey={order.id} key={order.id} >
                                <Accordion.Header onClick={() => toggleProgressStatus(order.customer_id, order.id, color)}>
                                    <Row className={`w-100 fs-5 text-center ${color}`} >
                                        <Col colSpan={1}>{order.id}</Col>
                                        <Col colSpan={1}>{order.customer_id}</Col>
                                        <Col className='text-nowrap' colSpan={7}>
                                                {date} <br /> {time}
                                        </Col>
                                        <Col colSpan={3}>${order.total_amount} </Col>
                                    </Row>
                                </Accordion.Header>
                                <Accordion.Body className="bg-body-tertiary text-center text-warning-emphasis" eventKey={order.id.toString()}>
                                    <Card.Body className='pb-2'>
                                        <Row className='pb-3 fs-5 pt-2'>
                                            <Col colSpan={1}>{tracking[order.id]?.status || 'Loading...'}</Col>
                                            <Col colSpan={11}>
                                                <ProgressBar className='w-100' now={tracking[order.id]?.percent || 0} variant={tracking[order.id]?.variant || 'secondary'} animated />
                                            </Col>
                                        </Row>
                                        <Card.Footer>
                                            <Row className='w-100'>
                                                <Col as={Button} variant='outline-warning' onClick={() => handleEditOrder(order.id)} >Edit Order</Col>
                                                <Col as={Button} variant='outline-danger' onClick={() => handleDelete(order.id)} >Delete/Cancel</Col>
                                                <Col as={Button} variant='outline-light' onClick={() => handleDetails(order.id)} >More Details</Col>
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

