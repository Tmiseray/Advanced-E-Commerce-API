
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, Nav, Card, Button, ProgressBar, Modal, Spinner, Container, Row, Col, NavLink, useAccordionButton } from "react-bootstrap";
import axios from "axios";

function CustomerProfile() {
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [details, setDetails] = useState({});
    const [tracking, setTracking] = useState({});
    const [showDelete, setShowDelete] = useState(false);
    const [currentVariant, setCurrentVariant] = useState('outline-info');
    const variantList = ['outline-info', 'outline-light'];
    const [currentColor, setCurrentColor] = useState('info-subtle');
    const colorList = ['info-subtle', 'light-subtle'];

    const navigate = useNavigate();

    const getStorageItems = () => {
        const storedId = JSON.parse(sessionStorage.getItem('id'));
        const storedName = JSON.parse(sessionStorage.getItem('name'));
        setId(storedId);
        setName(storedName);
    };

    const orderHistory = async (id) => {
        setError('');

        try {
            const response = await axios.post(`http://127.0.0.1:5000/orders/history-for-customer/${id}`);
            setOrders(response.data);
            console.log(orders);
        } catch (error) {
            setError('Error fetching order history:', error);
        }
    };

    const trackingInformation = async (id, orderId) => {
        setError('');

        try {
            const response = await axios.post(`/orders/track-status/?customer_id=${id}&order_id=${orderId}`);
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

    const toggleOrderDetails = (orderId, variant, color, eventKey) => {
        useAccordionButton(eventKey);
        setDetails(prev => ({...prev, [orderId]: !prev[orderId] }));
        setCurrentVariant(variant);
        setCurrentColor(color);
    };

    const toggleProgressStatus = (eventKey) => {
        useAccordionButton(eventKey);
    };

    const handleClose = () => {
        if (showDelete) {
            setShowDelete(false);
        }
        setShowRedirect(false);
    };

    const handleEditOrder = (orderId) => {
        setShowRedirect(true);
        navigate(`/orders/${orderId}`);
    };

    const handleDelete = async (orderId) => {
        setShowDelete(true);
        setError('');

        try {
            const response = await axios.delete(`http://127.0.0.1:5000/orders/${orderId}`);
            
        } catch (error) {
            setError('Error deleting order:', error);
        }
    };

    useEffect(() => {
        getStorageItems();
        orderHistory(id);
    }, [id]);

    if (showDelete) return
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
        <Container className="d-flex align-items-center justify-content-center bg-body-secondary mt-3" >
            <header className="text-center p-5">
                <h1 className="text-decoration-underline text-warning mb-3" >Welcome Back {name}!</h1>
                <p>Your personalized profile contains all relevant information regarding your account with us!</p>
                <p>Check out each section below for any new updates!</p>
                <p>As always, Thank you for continuing to be a loyal customer with</p>
                <h2 className="text-decoration-underline text-warning mb-3" >
                    EMPIRE LUX
                </h2>
                <p>Remember that with us You </p>
                <p className="text-warning-emphasis h3 mt-0 mb-5" >
                    Reign Supreme
                </p>
            </header>
            <Container fluid>
                <Row className="g-3" >
                    <Col xs={2}>
                        <Container className="bg-warning-subtle" >
                            <Nav className='flex-column'>
                                <div className="d-grid gap-3">
                                    <h3 className="text-decoration-underline text-warning mb-3">Quick Links</h3>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate('/products/active-products')} >
                                        Shop Products
                                    </Button>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Edit Contact Info
                                    </Button>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Edit Login Info
                                    </Button>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Contact Us
                                    </Button>
                                </div>
                            </Nav>
                        </Container>
                    </Col>
                    <Col xs={5} >
                        <Container className="bg-secondary-subtle">
                            <div className="d-grid gap-2" >
                                <h3 className="text-decoration-underline text-warning mb-3">Order History</h3>
                                {error && <p className="text-danger">{error}</p> }
                                <Row>
                                    <h4 className="text-decoration-underline text-info mb-2">
                                        <Col xs={2}>Order Id</Col>
                                        <Col xs={6}>Date - Time Placed</Col>
                                        <Col xs={4}>Total Amount</Col>
                                    </h4>
                                </Row>
                                <Accordion defaultActiveKey={'0'} >
                                    {orders.map((order, index) => {
                                        const variant = variantList[index % variantList.length];
                                        const [ date, time ] = order.order_date_time.split('T');
                                        const color = colorList[index % colorList.length];
                                        return (
                                                <Card bg={color} >
                                                    <Card.Header>
                                                        <Button eventKey={order.id} variant={variant} type="button" onClick={() => toggleOrderDetails(order.id, variant, color, order.id)} >
                                                            <Col xs={2}>{order.id}</Col>
                                                            <Col xs={6}>{date} - {time}</Col>
                                                            <Col xs={4}>${order.total_amount} </Col>
                                                        </Button>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={order.id} >
                                                        <Card.Body>
                                                            <Row className="bg-black text-center text-warning" >
                                                                <Col xs={1}>Quantity</Col>
                                                                <Col xs={1}>Product ID</Col>
                                                                <Col xs={6}>Product Name</Col>
                                                                <Col xs={4}>Price per Unit</Col>
                                                            </Row>
                                                            {details[order.id] && order.order_details.map(detail => (
                                                                <Row key={detail.product_id} >
                                                                    <Col xs={1}>{detail.quantity}</Col>
                                                                    <Col xs={1}>{detail.product_id}</Col>
                                                                    <Col xs={6}>{detail.product_name}</Col>
                                                                    <Col xs={4}>${detail.price_per_unit}</Col>
                                                                </Row>
                                                            ))}
                                                        </Card.Body>
                                                        <Card.Footer>
                                                            <Button variant="outline-warning" type="button" onClick={() => handleEditOrder(order.id)}>Edit</Button>
                                                            <Button variant="outline-danger" type="button" onClick={() => handleDelete(order.id)}>Delete</Button>
                                                        </Card.Footer>
                                                    </Accordion.Collapse>
                                                </Card>
                                        )
                                    }) }
                                </Accordion>
                            </div>
                        </Container>
                    </Col>
                    <Col xs={5} >
                        <Container className="bg-info-subtle">
                            <div className="d-grid gap-2" >
                                <h3 className="text-decoration-underline text-warning mb-3">Order Progress</h3>
                                {error && <p className="text-danger">{error}</p> }
                                <Row>
                                    <h4 className="text-decoration-underline text-info mb-2">
                                        <Col xs={2}>Order Id</Col>
                                        <Col xs={8}>Progress</Col>
                                    </h4>
                                </Row>
                                <Accordion defaultActiveKey={'0'} >
                                    {orders.map((order) => {
                                        trackingInformation(order.id);
                                        return (
                                            <Card key={order.id} bg={currentColor} >
                                                <Card.Header>
                                                    <Button eventKey={order.id} variant={currentVariant} type="button" onClick={() => toggleProgressStatus(order.id)} >
                                                        <Col xs={2}>{tracking[order.id]}</Col>
                                                        <Col xs={10}>
                                                            <ProgressBar now={tracking[order.id].percent} variant={tracking[order.id].variant} animated />
                                                        </Col>
                                                    </Button>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={order.id} >
                                                    <Card.Body>
                                                        <Row className="bg-black text-center text-warning" >
                                                            <Col xs={2}>Status:</Col>
                                                            <Col xs={8}>{tracking[order.id].status} </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        )
                                    })}
                                </Accordion>
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to edit details for {orders.order_id} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={() => setShowRedirect(false)} >
                        Back to Profile
                    </Button>
                    <Button variant='outline-primary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerProfile;