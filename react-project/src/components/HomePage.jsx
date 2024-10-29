/*

*/


import { Stack, Button, Container, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center bg-body-secondary mt-3" >
                <header className="text-center p-5" >
                    <h1 className="text-decoration-underline mb-5" >
                        Empire Lux
                    </h1>
                    <p className="mt-3 mb-5" >
                        Reign Supreme
                    </p>
                    <p>We offer a wide variety of regal products for an affordable price!</p>
                    <p>Check out what we have available and then create an account to place your order!</p>
                    <br />
                    <Button size="lg" className="homeButton shadow-lg" onClick={() => navigate('/products')} >
                        Shop Now!
                    </Button>
                </header>
            </Container>
        </>
    );
};

export default HomePage;