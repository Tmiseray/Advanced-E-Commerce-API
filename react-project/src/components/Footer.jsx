
import { Container, Row, Col, Image, Nav } from "react-bootstrap";

function Footer() {
    return (
        
            <footer className='bg-black bg-gradient justify-content-between alight-items-center text-center w-100' >
                <Row>
                    <Col></Col>
                    <Col>
                        <Nav.Link to='/' className="navLink" activeclassname='active' >
                            <Image src="./src/assets/EmpireLuxLogo.png" alt="Logo" thumbnail />
                        </Nav.Link>
                    </Col>
                    <Col></Col>
                </Row>
            </footer>
        
    );
};

export default Footer;