
import { useNavigate } from "react-router-dom";
import { Accordion, Nav, Card, Button, ProgressBar, Modal, Spinner, Container, Row, Col, NavLink } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import FullCatalog from "./FullCatalog";
// import OrderList from "./OrderList";
import StockMonitor from "./StockMonitor";
import OrderHistory from "../OrderHistory";


function AdminProfile() {
    const [products, setProducts] = useState([]);
    const [customerOrders, setOrders] = useState([]);
    const [salesTotal, setSalesTotal] = useState('');
    const [weeklySales, setWeeklySales] = useState('');
    const [error, setError] = useState('');
    const [showRedirect, setShowRedirect] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
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

    const calcSalesTotal = () => {
        let total_sales = 0;
        customerOrders.forEach((order) => {
            total_sales += order.total_amount;
        });
        setSalesTotal(total_sales);
    };

    const calcWeeklySales = () => {
        let total_sales = 0;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        customerOrders.forEach((order) => {
            const orderDate = new Date(order.order_date_time.split('T')[0]);
            if (orderDate >= oneWeekAgo) {
                total_sales += order.total_amount;
            }
        });

        setWeeklySales(total_sales);
    };


    const handleClose = () => {
        if (isDeactivating) {
            setIsDeactivating(false);
        }
        setShowRedirect(false);
    };

    useEffect(() => {
        const loadOrders = async () => {
            await fetchOrders();
        };

        const loadProducts = async () => {
            await fetchCatalog();
        }

        loadOrders();
        loadProducts();
    }, [])

    useEffect(() => {
        calcSalesTotal();
        calcWeeklySales();
    }, [customerOrders]);


    return (
        <Container className="bg-body-secondary p-3 mt-3 pb-5" >
            <header className="text-center p-5">
                <h1 className="text-decoration-underline text-warning mb-3" >
                    Administration Manager
                </h1>
            </header>
            <Container fluid >
                <Row className="g-3" >
                    <Col xs={2} >
                        <Container className="bg-warning-subtle h-100 border border-3 border-warning-subtle" >
                            <Nav className=''>
                                <div className="d-grid g-3">
                                    <StockMonitor products={products} />
                                    <h3 className="text-decoration-underline text-warning pt-5 mb-3">Quick Links</h3>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate('/add-product')} >
                                        Add Product
                                    </Button>
                                    {/* <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Monitor Stock
                                    </Button>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Edit Login Info
                                    </Button>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Contact Us
                                    </Button> */}
                                </div>
                            </Nav>
                        </Container>
                    </Col>
                    <Col colspan={10} >
                            <Row className="ms-1 me-1 p-3 bg-success-subtle text-success-emphasis border border-3 border-success-subtle">
                                    <Col>
                                        <h2>Total Sales</h2>
                                        <h3 className="text-decoration-none fw-bold fs-2">${salesTotal}</h3>
                                    </Col>
                                    
                                    <Col>
                                        <h2>Weekly Sales</h2>
                                        <h3 className="text-decoration-none fw-bold fs-2">${weeklySales}</h3>
                                    </Col>
                            </Row>
                            <Row className="m-1">
                                <Col colSpan={4} className="mt-1 p-2 bg-secondary-subtle shadow-lg border border-3 border-light-subtle">
                                    <FullCatalog />
                                </Col>
                                <Col colSpan={7} className="mt-1 ms-3 me-0 p-2 bg-dark-subtle shadow-lg border border-3 border-secondary">
                                    {/* <OrderList /> */}
                                    <OrderHistory />
                                </Col>
                            </Row>
                    </Col>
                </Row>
            </Container>
            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={handleClose} >
                        Back to Profile
                    </Button>
                    <Button variant='outline-primary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};

export default AdminProfile;