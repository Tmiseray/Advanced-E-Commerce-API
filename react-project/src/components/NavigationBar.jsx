/*

*/

import { NavLink } from "react-router-dom";
import { Navbar, Nav, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

function NavigationBar() {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ username, setUsername ] = useState('');
    const loginStatusKey = 'isLoggedIn';
    const usernameKey = 'username';

    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem(loginStatusKey);
        const storedUsername = sessionStorage.getItem(usernameKey);
        if (storedLoginStatus) {
            setIsLoggedIn(JSON.parse(storedLoginStatus));
        }
        if (storedUsername) {
            setUsername(JSON.parse(storedUsername));
        }
    }, []);

    return (
        <Navbar bg='black' expand='lg' className="mb-5" >
            <Navbar.Brand className="ms-3" href="/" >
                <Image src="./src/assets/EmpireLuxLogo.png" alt="Logo" thumbnail/>
            </Navbar.Brand>
            <Navbar.Toggle className="border-warning" aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id="basic-navbar-nav" >
                <Nav className="mr-3 ms-3" >
                    <Nav.Link as={NavLink} to='/' className="navLink" activeclassname='active' >
                        Home
                    </Nav.Link>
                    {isLoggedIn && username ==='admin' 
                        ? <Nav.Link as={NavLink} to='/catalog' className="navLink" activeclassname='active' >
                            Catalog
                        </Nav.Link>
                        : <Nav.Link as={NavLink} to='/products/active-products' className="navLink" activeclassname='active' >
                            Products
                        </Nav.Link>
                    }
                    {username ==='admin' 
                        && <Nav.Link as={NavLink} to='/catalog/stock-monitor' className="navLink" activeclassname='active' >
                            Stock Monitor
                        </Nav.Link>
                    }
                    {isLoggedIn
                        ? (username ==='admin' 
                            ? <Nav.Link as={NavLink} to='/catalog' className="navLink" activeclassname='active' >
                                Orders
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to={`/orders/history-for-customer/${id}`} className="navLink" activeclassname='active' >
                                Order History
                            </Nav.Link>)
                        : ''
                    }
                    {isLoggedIn 
                        ? (username === 'admin'
                            ? <Nav.Link as={NavLink} to='/customers' className="navLink" activeclassname='active' >
                                Customers
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to={`/customer-profile/${id}`} className="navLink" activeclassname='active' >
                                Profile
                            </Nav.Link>)
                        : <Nav.Link as={NavLink} to='/customers' className="navLink" activeclassname='active' >
                            Account Creation
                        </Nav.Link>
                    }  {/* Maybe adjust to /account-creation instead of customers */}
                    {isLoggedIn 
                        ? <Nav.Link as={NavLink} to='/logout' className="navLink" activeclassname='active' >
                            Logout
                        </Nav.Link>
                        : <Nav.Link as={NavLink} to='/login' className="navLink" activeclassname='active' >
                            Login
                        </Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;