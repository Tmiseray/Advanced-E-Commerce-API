/*
- Read Customer Details: Create a component to display customer details retrieved from the backend based on their unique identifier (ID).
 - Delete Customer Information: Build a function in your Customer Detail Component that when triggered will delete a customer from the backend based on their unique identifier (ID).
 - Customer Confirmation Module: Design a confirmation modal or component for securely creating, updating or deleting a customer from the system based on its unique ID


*/

import axios from 'axios';
import { array, func } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Spinner, Table } from "react-bootstrap";

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [customerAccount, setCustomerAccount] = useState([]);
    const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
    const [isFetchingAccount, setIsFetchingAccount] = useState(false);
    const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [showRedirect, setShowRedirect] = useState(false);
    const { username } = useParams();
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
            setCustomerAccount(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error.message);
            setError('Error fetching customer account:', error.message);
        } finally {
            // clearTimeout(timeoutId);
            setIsFetchingAccount(false);
        }
    };

    const handleClose = () => {
        setShowRedirect(false);
    };

    const toggleAccount = (id) => {
        if (customerAccount && customerAccount.customer_id === id) {
            setCustomerAccount([]);
        } else {
            fetchCustomerAccount(id);
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
                <Table striped hover >
                    <thead>
                        <tr>
                            <th className='text-center'>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th className='text-center' colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={5}>No customers registered.</td>
                            </tr>
                        ) : (
                            customers.map(customer => (
                                <React.Fragment key={customer.id}>
                                    <tr>
                                        <td className='text-center'>{customer.id}</td>
                                        <td>{customer.name} </td>
                                        <td>{customer.email} </td>
                                        <td>{customer.phone} </td>
                                        <td>
                                            <Button variant='outline-info' onClick={() => toggleAccount(customer.id)}>
                                                {customerAccount && customerAccount.customer_id === customer.id ? 'Hide Account' : 'Show Account' }
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant='outline-warning' onClick={() => handleEditContact(customer.id)}>
                                                Edit Contact Info
                                            </Button>
                                        </td>
                                    </tr>
                                    {customerAccount.customer_id === customer.id && (
                                        customerAccount.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan={6}>This customer has no login details at this time.</td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td className='pt-2'>
                                                    <strong>Login Info:</strong>
                                                    <div className='text-primary-emphasis'>Username: </div>
                                                    <div className='text-danger-emphasis'>Password: </div>
                                                </td>
                                                <td className='align-content-end' colSpan={3}>
                                                    <div>{customerAccount.username}</div>
                                                    <div>{customerAccount.password}</div>
                                                </td>
                                                <td>
                                                    <Button variant='outline-info' onClick={() => handleEditAccount(customerAccount.customer_id)}>
                                                        Edit Account Info
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant='outline-danger' onClick={() => handleDeletion(customerAccount.customer_id)}>
                                                        Delete Customer
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                               </React.Fragment>
                            ))
                        )}
                    </tbody>
            </Table>
            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
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