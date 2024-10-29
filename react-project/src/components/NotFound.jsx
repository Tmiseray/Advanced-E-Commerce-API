/*

*/

import { Container, Row, Col, Image, Nav } from "react-bootstrap";

function NotFound() {
    return (
        <Container className="text-center" >
            <Row className="p-3" >
                <Col>
                    <Image></Image>
                </Col>
            </Row>
            <Row className="p-3" >
                <Col>
                    <h2></h2>
                </Col>
            </Row>
            <Row className="p-3" >
                <Col>
                    <p></p>
                    <p></p>
                </Col>
            </Row>
            <Nav variant="pills" className="justify-content-center align-content-center p-3" >
                <Nav.Item className="btn" >
                    <Nav.Link href="/" className="fw-bold fs-5" >
                        Home Page
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Container>
    );
};

export default NotFound;