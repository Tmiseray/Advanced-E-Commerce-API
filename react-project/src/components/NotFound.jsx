/*

*/
import { useState } from "react";
import { Container, Row, Col, Image, Nav, Modal, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const [showRedirect, setShowRedirect] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setShowRedirect(false);
        navigate('/');
    };

    return (
        <Container className="text-center" >
            <Row className="p-3" >
                <Col>
                    <Image className="w-75" src="./src/assets/openMouthCat.avif" alt="Oh No!" ></Image>
                </Col>
                <Col>
                    <Row className="p-3" >
                        <Col>
                            <h2 className="text-warning" >Oh No!</h2>
                        </Col>
                    </Row>
                    <Row className="p-3" >
                        <Col>
                            <p>Looks like the page you are looking for does not exist.</p>
                            <p>Click the button below to go back to our Home Page.</p>
                        </Col>
                    </Row>
                    <Row className="p-3" >
                        <Col>
                        <Nav className="justify-content-center align-content-center p-3" >
                            <Nav.Item >
                                <Nav.Link onClick={() => setShowRedirect(true)} className="navLink fw-bold fs-5" >
                                    Home Page
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <Modal className="text-center" show={showRedirect} onHide={handleClose} backdrop='static' keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title>Redirection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Redirecting you to the Home Page <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> <Spinner animation="grow" size="sm" /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-info' onClick={handleClose} >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default NotFound;