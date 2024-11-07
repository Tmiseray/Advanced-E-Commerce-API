
import OrderHistory from "../OrderHistory";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, Nav, Card, Button, ProgressBar, Modal, Spinner, Container, Row, Col, NavLink, useAccordionButton } from "react-bootstrap";
import axios from "axios";

function CustomerProfile() {
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [showDelete, setShowDelete] = useState(false);

    const navigate = useNavigate();

    const getStorageItems = () => {
        const storedId = JSON.parse(sessionStorage.getItem('id'));
        const storedName = JSON.parse(sessionStorage.getItem('name'));
        setId(storedId);
        setName(storedName);
    };

    useEffect(() => {
        getStorageItems();
    }, [id]);

    if (showDelete) {
        return (
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
            </Modal>
        )
    };

    return (
        <>
        <Container className="customerNav bg-warning-subtle h-100" >
            <Nav>
                <div className="d-grid gap-4">
                    <h3 className="h2 text-decoration-underline text-warning mb-3">Quick Links</h3>
                    <Button className="text-center fs-5" type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate('/products/active-products')} >
                        Shop Products
                    </Button>
                    <Button className="text-center fs-5" type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate(`/customers/${id}`)} >
                        Edit Contact Info
                    </Button>
                    <Button className="text-center fs-5" type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate(`/accounts/${id}`)} >
                        Edit Login Info
                    </Button>
                    <Button className="text-center fs-5" type="button" variant="outline-warning" activeclassname='active' onClick={() => navigate(`/not-found`)} >
                        Contact Us
                    </Button>
                </div>
            </Nav>
        </Container>
        <Container className="customerContainer bg-body-secondary p-3 mt-3 pb-5 mb-5" >
            <header className="text-center p-5">
                <h1 className="text-decoration-underline text-warning mb-3" >Welcome Back {name}!</h1>
                <p>Your personalized profile contains all relevant information regarding your account with us!</p>
                <p>Check out each section below for any new updates!</p>
                <p>As always, Thank you for continuing to be a loyal customer with</p>
                <h2 className="text-decoration-underline text-warning mb-3 fs-1" >
                    EMPIRE LUX
                </h2>
                <p>Remember that with us ... <br /><b><i className="fs-3"> You </i></b></p>
                <p className="text-warning-emphasis text-decoration-underline h3 mt-0 mb-5" >
                    Reign Supreme
                </p>
            </header>
            <Container fluid>
                <Row className="g-3" >
                    <Col colSpan={10} >
                        <OrderHistory />
                    </Col>
                </Row>
            </Container>
        </Container>
        </>
    );
};

export default CustomerProfile;