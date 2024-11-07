
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Row, Col, Accordion, Card } from "react-bootstrap";

function OrderDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState({});
    const [details, setDetails] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [total, setTotal] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchOrder = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/orders/${id}`);
            setOrder(response.data);
            const [ oDate, oTime ] = response.data.order_date_time.split('T');
            setDate(oDate);
            setTime(oTime);
            const oTotal = response.data.total_amount;
            setTotal(oTotal.toFixed(2));
            console.log(response.data);
            setDetails(response.data.order_details);
        } catch (error) {
            setError('Error fetching order:', error);
            console.error(error);
        } finally {
            setIsLoading(false);
            
        }
    };

    const toggleOrderDetails = () => {
        setShowDetails(prevState => !prevState);
    };

    const handleRedirect = () => {
        if (customerId !== 7) {
            navigate(`/customer-profile/${customerId}`);
        } else {
            navigate('/admin-profile');
        }
    };

    useEffect(() => {
        const storedId = sessionStorage.getItem('id');
        if (storedId) {
            setCustomerId(JSON.parse(storedId));
        }

        fetchOrder(id);
    }, [id]);

    if (isLoading) {
        return (
            <p>
                Fetching Order Details 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </p>
        )
    };

    return (
        <Container>

             <Container className="detailsContainer mt-3 p-3 mb-5 bg-secondary-subtle rounded">
                <div className="d-grid gap-2" >
                    <h3 className="h1 text-decoration-underline text-warning mb-3">Order Details</h3>
                    {error && <p className="text-danger">{error}</p> }
                    <Row className="text-decoration-underline text-center text-secondary-emphasis mb-2 fs-4 ps-3 pe-5">
                        <Col colSpan={2}>Order Id</Col>
                        <Col colSpan={6}>Date - Time Placed</Col>
                        <Col colSpan={4}>Total Amount</Col>
                    </Row>
                    <Accordion className={'border border-primary rounded'} defaultActiveKey={'0'} >
                        <Accordion.Item eventKey={String(order.id)} key={order.id}>
                            <Accordion.Header onClick={() => toggleOrderDetails(order.id)}>
                                <Row className='d-flex align-items-center w-100 fs-5 text-center'>
                                    <Col colSpan={2}>{order.id}</Col>
                                    <Col colSpan={6}>{date} <br /> {time}</Col>
                                    <Col colSpan={4}>${total} </Col>
                                </Row>
                            </Accordion.Header>
                            <Accordion.Body className="bg-black text-center" eventKey={String(order.id)} >
                                <Card.Body className='pb-2'>
                                    <Row className="pb-3 fs-5 pt-2 text-decoration-underline text-secondary-emphasis" >
                                        <Col colSpan={1}>Quantity</Col>
                                        <Col colSpan={1}>Product ID</Col>
                                        <Col colSpan={6}>Product Name</Col>
                                        <Col colSpan={4}>Price per Unit</Col>
                                    </Row>
                                    {details.length > 0 && details.map(detail => (
                                        <Row className='mb-4' key={detail.product_id} >
                                            <Col className='text-light' colSpan={1}>{detail.quantity}</Col>
                                            <Col className='text-danger-emphasis fw-bold' colSpan={1}>{detail.product_id}</Col>
                                            <Col className='text-primary-emphasis fw-bold' colSpan={6}>{detail.product_name}</Col>
                                            <Col className='text-success-emphasis' colSpan={4}>${detail.price_per_unit}</Col>
                                        </Row>
                                    ))}
                                </Card.Body>
                                <Card.Footer>
                                    <Button className='w-100 fs-5' variant='outline-light' type='button' onClick={() => handleRedirect()} >Back to Profile</Button>
                                </Card.Footer>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Container>
        </Container>
    );
};

export default OrderDetails;