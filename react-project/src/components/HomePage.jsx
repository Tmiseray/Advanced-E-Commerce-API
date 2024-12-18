/*

*/


import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="p-5" >
            <Container className="headerContainer mb-4 d-flex align-items-center justify-content-center bg-body-secondary" >
                <header className="text-center p-5" >
                    <h1 className="text-decoration-underline text-warning mb-3" >
                        EMPIRE LUX
                    </h1>
                    <p className="text-warning-emphasis h3 mt-0 mb-5" >
                        Reign Supreme
                    </p>
                    <p>We offer a wide variety of regal products for an affordable price!</p>
                    <p>Check out what we have available and then create an account to place your order!</p>
                    <br />
                    <Button variant="outline-warning" className="shopBtn text-center shadow-lg" onClick={() => navigate('/products/active-products')} >
                        Shop Now!
                    </Button>
                </header>
            </Container>
        </div>
    );
};

export default HomePage;