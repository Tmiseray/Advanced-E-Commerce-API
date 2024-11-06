/*
- Read Customer Details: Create a component to display customer details retrieved from the backend based on their unique identifier (ID).
 - Delete Customer Information: Build a function in your Customer Detail Component that when triggered will delete a customer from the backend based on their unique identifier (ID).
 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID


*/

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Accordion, Modal, Spinner, Card, Row, Col } from "react-bootstrap";

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [customersAccounts, setCustomersAccounts] = useState({});
    const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
    const [isFetchingAccount, setIsFetchingAccount] = useState(false);
    const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
    const [activeAccountKey, setActiveAccountKey] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [showRedirect, setShowRedirect] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const fetchCustomers = async () => {
        setIsFetchingCustomers(true);
        setError('');

        const timeoutDuration = 10000;
        const timeoutId = setTimeout(() => {
            setIsFetchingCustomers(false);
        }, timeoutDuration);

        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
            console.log(response.data);
        } catch (error) {
            setError('Error fetching customers:', error)
        } finally {
            clearTimeout(timeoutId);
            setIsFetchingCustomers(false);
        }
    };

    const fetchCustomerAccount = async (customerId) => {

        setIsFetchingAccount(true);
        setError('');

        try {
            const response = await axios.get(`http://127.0.0.1:5000/accounts/${customerId}`);
            const accountData = response.data;
            setCustomersAccounts((prevAccounts) => ({
                ...prevAccounts,
                [customerId]: {
                    username: accountData.username,
                    password: accountData.password
                },
            }))
            console.log(accountData);
        } catch (error) {
            console.error(error.message);
            setError('Error fetching customer account:', error.message);
        } finally {
            setIsFetchingAccount(false);
        }
    };

    const handleClose = () => {
        setShowRedirect(false);
    };

    const toggleAccount = (id) => {
        if (activeAccountKey && activeAccountKey === id) {
            setActiveAccountKey(null);
        } else {
            fetchCustomerAccount(id);
            setActiveAccountKey(id);
        }
    };

    const handleEditContact = (id) => {
        setShowRedirect(true);
        navigate(`/customers/${id}`);
    };

    const handleEditAccount = (id) => {
        setShowRedirect(true);
        navigate(`/accounts/${id}`)
    };

    const handleCreateAccount = (id) => {
        setShowRedirect(true);
        navigate(`/create-account/${id}`);
    }

    const handleDeletion = async (id) => {
        setIsDeletingCustomer(true);
        setError('');

        try {
            const response = await axios.delete(`http://127.0.0.1:5000/customers/${id}`);
            setDeleteMessage(response.data);
        } catch (error) {
            setError('Error deleting customer:', error);
        } finally {
            setIsDeletingCustomer(false);
        }
    };


    useEffect(() => {
        fetchCustomers();
    }, []);

    if (isFetchingCustomers || isFetchingAccount) {
        return  (
            <div>
                Fetching Customers 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
                <Spinner animation="grow" size="sm" /> 
            </div>
        )
    };

    if (isDeletingCustomer) {
        return (
            <Modal onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting Customer Data 
                    <Spinner animation="grow" size="sm" /> 
                    <Spinner animation="grow" size="sm" /> 
                    <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    };


    return (
        <Container fluid className='customerContainer mt-5 p-3 mb-5 bg-info-subtle rounded'>
            <h2 className='text-info mb-5 h1' >Customers</h2>
                {error && <div className="text-danger">{error}</div>}
                <Row className='fs-4 fw-bold text-center text-decoration-underline text-secondary-emphasis'>
                    <Col colSpan={1}>ID</Col>
                    <Col colSpan={1}>Name</Col>
                    <Col colSpan={5}>Email</Col>
                    <Col colSpan={2}>Phone</Col>
                    <Col colSpan={2}>Actions</Col>
                </Row>
                <Accordion className='border border-primary rounded mb-5' defaultActiveKey={'0'}>
                    {customers.length === 0 ? (
                        <Accordion.Header>No Customers Registered.</Accordion.Header>
                    ) : (
                        customers.map(customer => (
                            <Accordion.Item eventKey={customer.id} key={customer.id}>
                                <Accordion.Header onClick={() => toggleAccount(customer.id)}>
                                    <Row className='align-items-center text-center w-100 fs-5'>
                                        <Col colSpan={1}>{customer.id}</Col>
                                        <Col colSpan={1}>{customer.name}</Col>
                                        <Col colSpan={5}>{customer.email}</Col>
                                        <Col colSpan={2}>{customer.phone}</Col>
                                        <Col colSpan={2}>
                                            <Row className='mb-5'>
                                                <Button className='fs-5' variant='outline-info'>
                                                    Account Details
                                                </Button>
                                            </Row>
                                            <Row>
                                                <Button className='fs-5' variant='outline-warning' onClick={() => handleEditContact(customer.id)}>
                                                    Edit Contact Info
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Accordion.Header>
                                <Accordion.Body className='bg-body-tertiary' eventKey={customer.id.toString()}>
                                    <Card.Body>
                                        <Row className='pb-3 fs-5 align-items-center'>
                                            <Col colSpan={3} className='loginCol'>
                                                <strong>Login Info:</strong>
                                                <Row className='text-primary-emphasis'>Username: </Row>
                                                <Row className='text-danger-emphasis'>Password: </Row>
                                            </Col>
                                            <Col className='mb-0 pb-0'>
                                                <Row className='pt-4 mt-3'></Row>
                                                <Row>{customersAccounts[customer.id]?.username || 'None'}</Row>
                                                <Row className='pe-5'>{customersAccounts[customer.id]?.password || 'None'}</Row>
                                            </Col>
                                            <Col colSpan={1} className='me-4'>
                                                {customersAccounts[customer.id] && customersAccounts[customer.id].username !== undefined ? (
                                                    <>
                                                        <Row className='mb-3'>
                                                            <Button className='fs-5' variant='outline-info' onClick={() => handleEditAccount(customersAccounts.id.customer_id)}>
                                                                Edit Account Info
                                                            </Button>
                                                        </Row>
                                                        <Row>
                                                            <Button className='fs-5' variant='outline-danger' onClick={() => handleDeletion(customersAccounts[customer.id].customer_id)}>
                                                                Delete Customer
                                                            </Button>
                                                        </Row>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Row className='mb-3'>
                                                            <Button className='fs-5' variant='outline-info' onClick={() => handleEditAccount(customersAccounts.id.customer_id)}>
                                                                Create Account Login
                                                            </Button>
                                                        </Row>
                                                        <Row>
                                                            <Button className='fs-5' variant='outline-danger' onClick={() => handleDeletion(customersAccounts[customer.id].customer_id)}>
                                                                Delete Customer
                                                            </Button>
                                                        </Row>
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                        <Card.Footer>
                                            <Row className='w-100'>
                                                
                                            </Row>
                                        </Card.Footer>
                                    </Card.Body>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                    )}
                </Accordion>
                
                    
            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to update details for customer <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-secondary' onClick={() => setShowRedirect(false)} >
                        Back to Customers
                    </Button>
                    <Button variant='outline-primary' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CustomerList;