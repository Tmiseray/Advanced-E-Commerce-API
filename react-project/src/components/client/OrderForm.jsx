
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { array } from 'prop-types';
import { Form, Button, Alert, Modal, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

function OrderForm() {
    const [products, setProducts] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [orderDetails, setOrderDetails] = useState([])
    const [checkedState, setCheckedState] = useState([]);
    const [total, setTotal] = useState(0);
    const [errors, setErrors] = useState([]);
    const [newOrderId, setNewOrderId] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const colorList = ['text-info', 'text-primary-emphasis'];
    const bgList = ['bg-info-subtle', 'bg-primary-subtle'];
    const { order_id } = useParams();
    const navigate = useNavigate();

    const getStorageItems = () => {
        const storedId = JSON.parse(sessionStorage.getItem('id'));
        setCustomerId(storedId);
    };

    const fetchProducts = async () => {
        setIsFetching(true);
        setErrors('');

        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
            setFetch(false);
        }, timeoutDuration);

        try {
            const response = await axios.get('http://127.0.0.1:5000/products/active-products');
            console.log(response.data);
            setProducts(response.data);
        } catch (error) {
            setErrors('Error fetching products:', error)
        } finally {
            clearTimeout(timeoutId);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getStorageItems();
        
        if (order_id) {
            axios.get(`http://127.0.0.1:5000/orders/${order_id}`)
            .then(response => {
                const fetchedOrderDetails = response.data.order_details || [];
                setOrderDetails(fetchedOrderDetails);
                
                const updatedCheckedState = products.map(product =>
                    fetchedOrderDetails.some(detail => detail.product_id === product.id)
                );
                setCheckedState(updatedCheckedState);
                updateTotal(fetchedOrderDetails);
            })
            .catch(error => setErrorMessage(error.message));
        }
        
        if (products.length === 0) {
            fetchProducts();
        }
    }, [order_id, products]);

    const handleCheckboxChange = (event, index, productId) => {
        const updatedCheckedState = [...checkedState];
        updatedCheckedState[index] = !updatedCheckedState[index]; 
    
        setCheckedState(updatedCheckedState);
    };
    
    const handleQuantityChange = (event, index, productId) => {
        const updatedQuantity = event.target.value;

        if (updatedQuantity === orderDetails[index]?.quantity) return;

        const updatedOrderDetails = [...orderDetails];
        const existingDetailIndex = updatedOrderDetails.findIndex(detail => detail.product_id === productId);

        if (existingDetailIndex !== -1) {
            updatedOrderDetails[existingDetailIndex].quantity = updatedQuantity;
        } else {
            updatedOrderDetails.push({
                product_id: productId,
                quantity: updatedQuantity,
            });
        }
    
        setOrderDetails(updatedOrderDetails);
        updateTotal(updatedOrderDetails);
    };

    const updateTotal = (updatedOrderDetails) => {
        let newTotal = 0;
        updatedOrderDetails.forEach(detail => {
            const product = products.find(p => p.id === detail.product_id);
            if (product) {
                newTotal += product.price * detail.quantity;
            }
        });
        setTotal(newTotal);
    };
    

    const validateForm = () => {
        let errors = [];
    
        orderDetails.forEach((item, index) => {
            if (!item.quantity) {
                errors[index] = errors[index] || {};
                errors[index].quantity = 'Quantity is required';
            }
        });
    
        setErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        console.log('Submit clicked');
        console.log("Submitting order with customerId:", customerId);
        console.log("Sending order details:", orderDetails); 

        if (!validateForm()) return;

        const formattedOrderDetails = orderDetails.map(item => ({
            product_id: item.product_id,
            quantity: parseInt(item.quantity),
        }))

        console.log(formattedOrderDetails)

        try {
            const payload = {
                customer_id: customerId,
                order_details: formattedOrderDetails,
            }
            let response;
            if (order_id) {
                response = await axios.put(`http://127.0.0.1:5000/orders/${order_id}`, payload);
            } else {
                response = await axios.post(`http://127.0.0.1:5000/place-order`, payload);
            }

            if (response.data.error) {
                setErrorMessage(response.data.error);
            } else {
                const returnedId = response.data.order_id;
                setNewOrderId(returnedId);
                setShowSuccess(true);
            }

        } catch (error) {
            setErrorMessage(error.response ? error.response.data.error : 'An unknown error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowSuccess(false);
        setOrderDetails([{ 
            product_id: '',
            product_name: '',
            quantity: '',
            price_per_unit: ''
         }]);
        setSubmitting(false);
        navigate(`/orders/details/${newOrderId}`);
    };

    if (isSubmitting || isFetching) return 
        <div>
            {isSubmitting ? 'Submitting' : 'Fetching'} {isSubmitting ? 'order' : 'products'} 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </div>;

    return (
        <Container>
            <Form className="orderForm p-4 mt-3 rounded text-center" onSubmit={handleSubmit} >
                <h3 className="fs-1 mb-4 text-warning">{order_id ? 'Edit' : 'Create'} Order</h3>
                {errorMessage && <Alert variant="danger" >{errorMessage}</Alert> }
                <h2 className="mb-4 text-danger-emphasis">Products</h2>
                <Row className="d-flex fs-3 text-center text-decoration-underline text-secondary-emphasis bg-black rounded pt-2 pb-2">
                    <Col xs={1} >Select</Col>
                    <Col xs={2} >ID</Col>
                    <Col xs={5} >Name</Col>
                    <Col xs={2} >Price</Col>
                    <Col xs={2} >Quantity</Col>
                </Row>
                {products.length > 0 && products.map((product, index) => {
                    const isChecked = checkedState[index];
                    const orderDetail = orderDetails.find(detail => detail.product_id === product.id);
                    const preFilledQuantity = orderDetail ? orderDetail.quantity : '';
                    const color = colorList[index % colorList.length];
                    const bg = bgList[index % bgList.length];
                    return (
                        <Row key={index} className={`d-flex align-items-center fs-4 text-center ${color} rounded pt-2 pb-2 ${bg} bg-gradient`}>
                            <Col xs={1}>
                                <Form.Check 
                                    type="checkbox"
                                    size='lg'
                                    id={`product-${product.id}`}
                                    checked={isChecked}
                                    onChange={(event) => handleCheckboxChange(event, index, product.id)}
                                    aria-label={`option ${index + 1}`}
                                />
                            </Col>
                            <Col xs={2} >{product.id}</Col>
                            <Col xs={5} >{product.name} </Col>
                            <Col xs={2} >${product.price} </Col>
                            <Col xs={2} >
                                <Form.Control 
                                    size="lg" 
                                    type="text"
                                    name={`quantity-${product.id}`}
                                    value={isChecked ? preFilledQuantity : ''}
                                    onChange={(event) => handleQuantityChange(event, index, product.id)}
                                    isInvalid={errors[index] && errors[index].quantity}
                                />
                            </Col>
                        </Row>
                    );
                })}
                <Row className="fs-3 rounded pt-4 text-danger-emphasis">
                    <Col className="text-end">Total:</Col>
                    <Col className="text-start">$ {total.toFixed(2)} </Col>
                </Row>
                <Row>
                    <Col>
                        <Button className="w-100 fs-4 mt-5" variant="outline-warning" type="reset">Reset</Button>
                    </Col>
                    <Col>
                        <Button className="w-100 fs-4 mt-5" variant="outline-info" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner as='span' animation="border" size="sm" /> : 'Submit' }
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Modal className="text-center" show={showSuccess} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className="text-success">Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Order information has been successfully {order_id ? 'updated' : 'submitted'}!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} >
                        View Order Details
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderForm;

OrderForm.propTypes = {
    products: array
}