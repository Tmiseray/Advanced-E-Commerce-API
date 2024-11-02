
import { useNavigate } from "react-router-dom";
import { Accordion, Nav, Card, Button, ProgressBar, Modal, Spinner, Container, Row, Col, NavLink } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import FullCatalog, { fetchCatalog, fetchDetails } from "./FullCatalog";
import OrderList, { fetchOrders } from "./OrderList";


function AdminProfile() {
    // const [catalogProducts, setProducts] = useState([]);
    // const [productDetails, setProductDetails] = useState([]);
    const [customerOrders, setOrders] = useState([]);
    // const [tracking, setTracking] = useState({});
    const [salesTotal, setSalesTotal] = useState('');
    const [weeklySales, setWeeklySales] = useState('');
    const [error, setError] = useState('');
    // const [activeCatalogKey, setActiveCatalogKey] = useState(null);
    // const [activeOrdersKey, setActiveOrdersKey] = useState(null);
    const [showRedirect, setShowRedirect] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    // const [currentVariant, setCurrentVariant] = useState('outline-primary');
    // const variantList = ['outline-primary', 'outline-info'];
    // const [currentColor, setCurrentColor] = useState('info-subtle');
    // const colorList = ['info-subtle', 'primary-subtle'];
    const navigate = useNavigate();


    // const fetchCatalog = async (setProducts, setError) => {
    //     setError('');
    
    //     const timeoutDuration = 10000;
    //     const timeoutId = setTimeout(() => {
    //     }, timeoutDuration);
    
    //     try {
    //         const response = await axios.get('http://127.0.0.1:5000/catalog');
    //         setProducts(response.data);
    //     } catch (error) {
    //         setError('Error fetching products:', error)
    //     } finally {
    //         clearTimeout(timeoutId);
    //     }
    // };
    
    // const fetchDetails = async (setProductDetails, setError, id) => {
    //     setError('');
    
    //     const timeoutDuration = 5000;
    //     const timeoutId = setTimeout(() => {
    //     }, timeoutDuration);
    
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
    //         setProductDetails(response.data);
    //     } catch (error) {
    //         setError('Error fetching product details:', error);
    //     } finally {
    //         clearTimeout(timeoutId);
    //     }
    // };


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

    // const toggleDetails = async (productId, variant, color) => {
    //     if (productDetails && productDetails.id === productId) {
    //         setProductDetails([]);
    //         setActiveCatalogKey(null);
    //     } else {
    //         const details = await fetchDetails(setProductDetails, setError, productId);
    //         // setProductDetails(details);
    //         setCurrentVariant(variant);
    //         setCurrentColor(color);
    //         setActiveCatalogKey(productId);
    //     }
    // };

    // const handleEditProduct = (id) => {
    //     setShowRedirect(true);
    //     navigate(`/products/${id}`);
    // };

    // const handleUpdateStock = (id) => {
    //     setShowRedirect(true);
    //     navigate(`/catalog/update-stock/${id}`);
    // };

    // const handleDeactivation = async (id) => {
    //     setIsDeactivating(true);
    //     setError('');

    //     try {
    //         const response = await axios.put(`http://127.0.0.1:5000/products/deactivate/${id}`);
    //         setDeactivateMessage(response.data);
    //     } catch (error) {
    //         setError('Error deactivating product:', error);
    //     } finally {
    //         setIsDeactivating(false);
    //     }
    // };

    const handleClose = () => {
        if (isDeactivating) {
            setIsDeactivating(false);
        }
        setShowRedirect(false);
    };

    // const trackingInformation = async (customerId, orderId) => {
    //     setError('');

    //     try {
    //         const response = await axios.post(`/orders/track-status/?customer_id=${customerId}&order_id=${orderId}`);
    //         const statusData = response.data;

    //         setTracking(prev => ({
    //             ...prev,
    //             [orderId]: {
    //                 status: statusData.status,
    //                 percent: getProgress(statusData.status),
    //                 variant: getVariant(statusData.status),
    //             }
    //         }));
    //     } catch (error) {
    //         setError('Error fetching tracking information:', error);
    //     }
    // };

    // const getProgress = (status) => {
    //     switch (status) {
    //         case "Order in process": return 25;
    //         case "Shipped": return 50;
    //         case "Out for delivery": return 75;
    //         case "Complete": return 100;
    //         default: return 0;
    //     }
    // };

    // const getVariant = (status) => {
    //     switch (status) {
    //         case "Order in process": return "warning";
    //         case "Shipped": return "success";
    //         case "Out for delivery": return "primary";
    //         case "Complete": return "info";
    //         default: return "secondary";
    //     }
    // };

    // const toggleProgressStatus = (customerId, orderId) => {
    //     if (tracking[orderId]) {
    //         setActiveOrdersKey(orderId); // If tracking info exists, show it
    //     } else {
    //         trackingInformation(customerId, orderId); // Fetch tracking info if not available
    //         setActiveOrdersKey(orderId);
    //     }
    // };

    // const handleOrderDetails = (orderId) => {
    //     setShowRedirect(true);
    //     navigate(`/orders/details/${orderId}`);
    // }

    useEffect(() => {
        // const loadOrders = async () => {
        //     await fetchOrders(setOrders, setError);
        // };

        // const loadCatalog = async () => {
        //     await fetchCatalog(setProducts, setError);
        // };

        fetchOrders();
        // fetchCatalog();
    })

    useEffect(() => {
        calcSalesTotal();
        calcWeeklySales();
    }, [customerOrders]);

    // if (isDeactivating) return
    //     <Modal onHide={handleClose} backdrop='static' keyboard={false} centered >
    //         <Modal.Header>
    //             <Modal.Title>Deactivation</Modal.Title>
    //         </Modal.Header>
    //         <Modal.Body>
    //             Deactivating Product 
    //             <Spinner animation="grow" size="sm" /> 
    //             <Spinner animation="grow" size="sm" /> 
    //             <Spinner animation="grow" size="sm" /> 
    //         </Modal.Body>
    //         <Modal.Footer>
    //             <Button variant='outline-secondary' onClick={handleClose} >
    //                 Continue
    //             </Button>
    //         </Modal.Footer>
    //     </Modal>;

    return (
        <Container className="bg-body-secondary mt-3" >
            <header className="text-center p-5">
                <h1 className="text-decoration-underline text-warning mb-3" >
                    Administration Manager
                </h1>
            </header>
            <Container fluid >
                <Row className="g-3" >
                    <Col xs={2} >
                        <Container className="bg-warning-subtle h-100" >
                            <Nav className=''>
                                <div className="d-grid g-3">
                                    <h3 className="text-decoration-underline text-warning pt-5 mb-3">Quick Links</h3>
                                    <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate('/add-product')} >
                                        Add Product
                                    </Button>
                                    {/* <Button as={NavLink} type="button" variant="outline-warning" activeclassname='active' onClick={d} >
                                        Edit Contact Info
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
                        <Container>
                            <Row className="ms-1 p-3 bg-success-subtle text-success-emphasis">
                                {/* <Row className="p-3 bg-success-subtle text-success-emphasis"> */}
                                    <Col>
                                        <h2>Total Sales</h2>
                                        <h3 className="text-decoration-none fw-bold fs-2">${salesTotal}</h3>
                                    </Col>
                                    
                                    <Col>
                                        <h2>Weekly Sales</h2>
                                        <h3 className="text-decoration-none fw-bold fs-2">${weeklySales}</h3>
                                    </Col>
                                {/* </Row> */}
                            </Row>
                            <Row className="m-1">
                                <Col colspan={5} className="m-1 p-2 bg-secondary-subtle shadow-lg">
                                    <FullCatalog />
                                </Col>
                                <Col colspan={6} className="m-1 p-2 bg-dark-subtle shadow-lg">
                                    <OrderList />
                                </Col>
                            </Row>
                        </Container>
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