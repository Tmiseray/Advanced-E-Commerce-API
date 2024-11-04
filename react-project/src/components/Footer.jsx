
import { Container, Row, Col, Image, Nav } from "react-bootstrap";

function Footer() {
    return (
        <Container className='justify-content-between alight-items-center text-center' >
            <p>Work in progress</p>
            <Footer className='bg-black shadow-lg ' >
                <Row>
                    <Col></Col>
                    <Col>
                        <Nav.Link to='/' className="navLink" activeclassname='active' >
                            <Image src="./src/assets/EmpireLuxLogo.png" alt="Logo" thumbnail />
                        </Nav.Link>
                    </Col>
                    <Col></Col>
                </Row>
            </Footer>
        </Container>
    );
};

export default Footer;