/*
- Read Customer Details: Create a component to display customer details retrieved from the backend based on their unique identifier (ID).
 - Delete Customer Information: Build a function in your Customer Detail Component that when triggered will delete a customer from the backend based on their unique identifier (ID).
 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID


*/

import axios from 'axios';
import { array, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Spinner } from "react-bootstrap";

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [customerAccount, setCustomerAccount] = useState([]);
    const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
    const [isFetchingAccount, setIsFetchingAccount] = useState(false);
    const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [currentVariant, setCurrentVariant] = useState('primary');
    const [showRedirect, setShowRedirect] = useState(false);
    const { username } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const variantList = ['primary', 'info'];


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

        const timeoutDuration = 5000;
        const timeoutId = setTimeout(() => {
            setIsFetchingAccount(false);
        }, timeoutDuration);

        try {
            const response = await axios.get(`http:127.0.0.1:5000/account/${customerId}`);
            setCustomerAccount(response.data);
        } catch (error) {
            setError('Error fetching customer account:', error);
        } finally {
            clearTimeout(timeoutId);
            setIsFetchingAccount(false);
        }
    };

    const handleClose = () => {
        setShowRedirect(false);
    };

    const toggleAccount = (id, variant) => {
        if (customerAccount.customer_id === id) {
            setCustomerAccount(null);
        } else {
            fetchCustomerAccount(id);
            setCurrentVariant(variant);
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

    if (isFetchingCustomers) return 
        <p>
            Fetching Customers 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
            <Spinner animation="grow" size="sm" /> 
        </p>;

    if (isFetchingAccount) return 
    <p>
        Fetching Account Details 
        <Spinner animation="grow" size="sm" /> 
        <Spinner animation="grow" size="sm" /> 
        <Spinner animation="grow" size="sm" /> 
    </p>;

    if (isDeletingCustomer) return
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
        </Modal>;


    return (
        <Container>
            <h2 className='text-warning mb-5 h1' >Customers</h2>
                {error && <p className="text-danger">{error}</p>}
                {customers.length === 0 ? (
                    <p>No customers registered.</p>
                ) : (
                    customers.map(customer => {
                        const variant = variantList[index % variantList.length];
                        return (
                            <div key={customer.id} >
                                <ListGroup horizontal >
                                    <ListGroup.Item action variant={variant}>ID: {customer.id} </ListGroup.Item>
                                    <ListGroup.Item action variant={variant}>{customer.name} </ListGroup.Item>
                                    <ListGroup.Item action variant={variant}>Email: {customer.email} </ListGroup.Item>
                                    <ListGroup.Item action variant={variant}>Phone: {customer.phone} </ListGroup.Item>
                                    <ListGroup.Item action variant='light' onClick={() => toggleAccount(customer.id, variant)} >Show Account</ListGroup.Item>
                                    <ListGroup.Item action variant='warning' onClick={() => handleEditContact(customer.id)} >Edit Contact Information</ListGroup.Item>
                                </ListGroup>
                                {customerAccount.customer_id === customer.id && (
                                    <ListGroup horizontal>
                                        <ListGroup.Item action variant={currentVariant} >Account Details</ListGroup.Item>
                                        <ListGroup.Item action variant={currentVariant}>Username: {customerAccount.username} </ListGroup.Item>
                                        <ListGroup.Item action variant={currentVariant}>Password: ${customerAccount.password} </ListGroup.Item>
                                        <ListGroup.Item action variant='warning' onClick={() => handleEditAccount(customerAccount.customer_id)}>Edit Account Details</ListGroup.Item>
                                        <ListGroup.Item action variant='danger' onClick={() => handleDeletion(customerAccount.customer_id)}>Delete Customer</ListGroup.Item>
                                    </ListGroup>
                                )}
                            </div>
                        )
                    })
                )}

            <Modal show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to edit details for {customerAccount.customer_id} <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
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