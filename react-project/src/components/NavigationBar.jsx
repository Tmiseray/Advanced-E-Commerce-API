/*

*/
import { func } from 'prop-types';
import { NavLink, useParams } from "react-router-dom";
import { Navbar, Nav, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

function NavigationBar({ handleLogout, isLoggedIn, isAdmin }) {
    // const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    // const [ isAdmin, setIsAdmin ] = useState(false);

    // useEffect(() => {
    //     const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    //     const adminStatus = sessionStorage.getItem('isAdmin');

    //     if (storedLoginStatus) {
    //         setIsLoggedIn(JSON.parse(storedLoginStatus));
    //     } else {
    //         setIsLoggedIn(false);
    //     }

    //     if (adminStatus) {
    //         setIsAdmin(JSON.parse(adminStatus));
    //     } else {
    //         setIsAdmin(false);
    //     }

    // }, [isLoggedIn, isAdmin]);

    const id = sessionStorage.getItem('id');

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
                    {isAdmin 
                        && <Nav.Link as={NavLink} to='/stock-monitor' className="navLink" activeclassname='active' >
                            Stock Monitor
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
                            ? <Nav.Link as={NavLink} to='/customers' className="navLink" activeclassname='active' >
                                Customers
                            </Nav.Link>
                            : <Nav.Link as={NavLink} to={`/customer-profile/${id}`} className="navLink" activeclassname='active' >
                                Profile
                            </Nav.Link>)
                        : <Nav.Link as={NavLink} to='/register' className="navLink" activeclassname='active' >
                            Account Creation
                        </Nav.Link>
                    }  {/* Maybe adjust to /account-creation instead of customers */}
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
        </Navbar>
    );
};

NavigationBar.propTypes = {
    handleLogout: func
}

export default NavigationBar;