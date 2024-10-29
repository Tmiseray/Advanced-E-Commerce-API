/*

*/

import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

function NavigationBar() {
    return (
        <Navbar bg='black' expand='lg' >
            <Navbar.Brand className="ms-3" href="/" >E-Commerce App</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mr-auto" >
                    <Nav.Link as={NavLink} to='/' activeclassname='active' >
                        Home
                    </Nav.Link>
                    {isLoggedIn && username ==='admin' 
                        ? <Nav.Link as={NavLink} to='/catalog' activeclassname='active' >
                            Catalog
                        </Nav.Link>
                        : <Nav.Link as={NavLink} to='/products/active-products' activeclassname='active' >
                            Products
                        </Nav.Link>
                    }
                    {username ==='admin' 
                        && <Nav.Link as={NavLink} to='/catalog/stock-monitor' activeclassname='active' >
                            Stock Monitor
                        </Nav.Link>
                    }
                    {isLoggedIn
                        ? (username ==='admin' 
                            ? <Nav.Link as={NavLink} to='/catalog' activeclassname='active' >
                                Orders
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to={`/orders/history-for-customer/${id}`} activeclassname='active' >
                                Order History
                            </Nav.Link>)
                        : ''
                    }
                    {isLoggedIn 
                        ? (username === 'admin'
                            ? <Nav.Link as={NavLink} to='/customers' activeclassname='active' >
                                Customers
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to={`/customer-profile/${id}`} activeclassname='active' >
                                Profile
                            </Nav.Link>)
                        : <Nav.Link as={NavLink} to='/customers' activeclassname='active' >
                            Account Creation
                        </Nav.Link>
                    }  {/* Maybe adjust to /account-creation instead of customers */}
                    {isLoggedIn 
                        ? <Nav.Link as={NavLink} to='/logout' activeclassname='active' >
                            Logout
                        </Nav.Link>
                        : <Nav.Link as={NavLink} to='/login' activeclassname='active' >
                            Login
                        </Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;