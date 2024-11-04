
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Modal, Spinner, Row, Col, Accordion, Card } from "react-bootstrap";

function OrderDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [currentColor, setCurrentColor] = useState('text-info');
    const colorList = ['text-info', 'text-primary-emphasis'];
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchDetails = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/orders/details/${id}`);
            setDetails(response.data);
        } catch (error) {
            setError('Error fetching details:', error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleOrderDetails = (id) => {
        if (details[id]) {
            setShowDetails(false);
        } else {
            setShowDetails(true);
        }
    };

    const handleRedirect = () => {
        if (id === 6) {
            navigate('/admin-profile');
        } else {
            navigate(`/customer-profile/${id}`);
        }
    };

    useEffect(() => {
        fetchDetails(id);
    }, [id]);

    if (isLoading) return
        <p>
            Fetching Order Details 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    return (
        <Container>
            <p>Work in progress</p>

             <Container className="bg-secondary-subtle">
                <div className="d-grid gap-2" >
                    <h3 className="text-decoration-underline text-warning mb-3">Order Details</h3>
                    {error && <p className="text-danger">{error}</p> }
                    <Row>
                        <h4 className="text-decoration-underline text-info mb-2">
                            <Col colSpan={2}>Order Id</Col>
                            <Col colSpan={6}>Date - Time Placed</Col>
                            <Col colSpan={4}>Total Amount</Col>
                        </h4>
                    </Row>
                    <Accordion defaultActiveKey={'0'} >
                        {orders.map((order, index) => {
                            const [ date, time ] = order.order_date_time.split('T');
                            const color = colorList[index % colorList.length];
                            return (
                                    <Card bg={color} >
                                        <Card.Header>
                                            <Button eventKey={order.id} variant={variant} type="button" onClick={() => toggleOrderDetails(order.id)} >
                                                <Col colSpan={2}>{order.id}</Col>
                                                <Col colSpan={6}>{date} - {time}</Col>
                                                <Col colSpan={4}>${order.total_amount} </Col>
                                            </Button>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={order.id} >
                                            <Card.Body>
                                                <Row className="bg-black text-center text-warning" >
                                                    <Col colSpan={1}>Quantity</Col>
                                                    <Col colSpan={1}>Product ID</Col>
                                                    <Col colSpan={6}>Product Name</Col>
                                                    <Col colSpan={4}>Price per Unit</Col>
                                                </Row>
                                                {details[order.id] && order.order_details.map(detail => (
                                                    <Row key={detail.product_id} >
                                                        <Col colSpan={1}>{detail.quantity}</Col>
                                                        <Col colSpan={1}>{detail.product_id}</Col>
                                                        <Col colSpan={6}>{detail.product_name}</Col>
                                                        <Col colSpan={4}>${detail.price_per_unit}</Col>
                                                    </Row>
                                                ))}
                                            </Card.Body>
                                            <Card.Footer>
                                                {/* <Button variant="outline-warning" type="button" onClick={() => handleEditOrder(order.id)}>Edit</Button>
                                                <Button variant="outline-danger" type="button" onClick={() => handleDelete(order.id)}>Delete</Button> */}
                                                <Button className='w-100' variant='outline-light' type='button' onClick={handleRedirect} >Back to Profile</Button>
                                            </Card.Footer>
                                        </Accordion.Collapse>
                                    </Card>
                            )
                        }) }
                    </Accordion>
                </div>
            </Container>
        </Container>
    );
};

export default OrderDetails;