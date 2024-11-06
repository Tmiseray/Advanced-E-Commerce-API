/*

*/
import { func } from 'prop-types';
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Image, Container } from "react-bootstrap";

function NavigationBar({ handleLogout, isLoggedIn, isAdmin }) {

    const id = sessionStorage.getItem('id');

    return (
        <Navbar fixed='top' bg='black' className="navBar" >
            <Container>
                <Navbar.Brand href="/" >
                    <Image src="./src/assets/EmpireLuxLogo.png" alt="Logo" thumbnail/>
                </Navbar.Brand>
                <Navbar.Toggle className="border-warning" aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="mr-3 ms-3" >
                        <Nav.Link as={NavLink} to='/' className="navLink" activeclassname='active' >
                            Home
                        </Nav.Link>
                        {isLoggedIn  
                            ? (isAdmin 
                                ? <Nav.Link as={NavLink} to='/catalog' className="navLink" activeclassname='active' >
                                    Catalog
                                </Nav.Link>
                                : <Nav.Link as={NavLink} to='/products/active-products' className="navLink" activeclassname='active' >
                                    Products
                                </Nav.Link>
                            )
                            : <Nav.Link as={NavLink} to='/products/active-products' className="navLink" activeclassname='active' >
                                Products
                            </Nav.Link>
                        }
                        {isLoggedIn
                            ? (isAdmin 
                                ? <Nav.Link as={NavLink} to='/orders' className="navLink" activeclassname='active' >
                                    Orders
                                </Nav.Link>
                                : <Nav.Link as={NavLink} to={`/orders/history-for-customer/${id}`} className="navLink" activeclassname='active' >
                                    Order History
                                </Nav.Link>)
                            : ''
                        }
                        {isLoggedIn 
                            ? (isAdmin
                                ? <>
                                    <Nav.Link as={NavLink} to='/customers' className="navLink" activeclassname='active' >
                                        Customers
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to='/admin-profile' className="navLink" activeclassname='active' >
                                        Admin Profile
                                    </Nav.Link>
                                </>
                                : <Nav.Link as={NavLink} to={`/customer-profile/${id}`} className="navLink" activeclassname='active' >
                                    Profile
                                </Nav.Link>)
                            : <Nav.Link as={NavLink} to='/register' className="navLink" activeclassname='active' >
                                Account Creation
                            </Nav.Link>
                        }
                        {isLoggedIn 
                            ? <Nav.Link onClick={handleLogout}  className="navLink" activeclassname='active' >
                                Logout
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to='/login' className="navLink" activeclassname='active' >
                                Login
                            </Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

NavigationBar.propTypes = {
    handleLogout: func
}

export default NavigationBar;