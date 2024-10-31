import { Route, Routes, useNavigate } from 'react-router-dom';
// Admin Components
import AdminProfile from './components/admin/AdminProfile';
import CustomerAccounts from './components/admin/CustomerAccounts';
import CustomerList from './components/admin/CustomerList';
import FullCatalog from './components/admin/FullCatalog';
import StockMonitor from './components/admin/StockMonitor';
import OrderList from './components/admin/OrderList';
import ProductForm from './components/admin/ProductForm';
import UpdateStockForm from './components/admin/UpdateStockForm';
// Client Components
import AccountForm from './components/client/AccountForm';
import CustomerForm from './components/client/CustomerForm';
import CustomerProfile from './components/client/CustomerProfile';
import OrderForm from './components/client/OrderForm';
import OrderHistory from './components/client/OrderHistory';
import ProductList from './components/client/ProductList';
// App Components
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import OrderDetails from './components/OrderDetails';
import TrackOrder from './components/TrackOrder';
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(sessionStorage.getItem('isLoggedIn')) || false);
  const [isAdmin, setIsAdmin] = useState(() => JSON.parse(sessionStorage.getItem('isAdmin')) || false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('name', '');
    sessionStorage.setItem('id', '')
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('isLoggedIn', JSON.stringify(false));
    sessionStorage.setItem('isAdmin', JSON.stringify(false));
  }, []);

  const handleLogin = (userData) => {
    setName(userData.name);
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
    sessionStorage.setItem('name', userData.name);
    sessionStorage.setItem('id', userData.id);
    sessionStorage.setItem('username', userData.username);
    sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
    sessionStorage.setItem('isAdmin', JSON.stringify(userData.isAdmin));

    handleSuccessLogin(userData.isAdmin, userData.id);
  }

  const handleSuccessLogin = (isAdmin, id) => {
    if (isAdmin || id === 6) {
        navigate('/admin-profile');
    } else {
        navigate(`/customer-profile/${id}`);
    }
  };

  const handleLogout = async () => {
    const storedName = sessionStorage.getItem('name');
    if (storedName) {
        setName(JSON.parse(storedName));
    }
    setShowLogoutMessage(true);
    
    await axios.get('http://127.0.0.1:5000/logout');

    sessionStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setName('');
  };

  const handleSuccessLogout = () => {
    setShowLogoutMessage(false);
    navigate('/login');
  }

  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Modal className="text-center" show={showLogoutMessage} onHide={() => setShowLogoutMessage(false)} backdrop='static' keyboard={false} centered >
          <Modal.Header closeButton>
            <Modal.Title className='text-info' >Goodbye!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Goodbye, {name}! <br /> You have been logged out.
          </Modal.Body>
          <Modal.Footer>
              <Button variant="outline-primary" onClick={handleSuccessLogout}>OK</Button>
          </Modal.Footer>
      </Modal>
      <Routes>
        <Route path='/' element={<HomePage  />} />
        <Route path='/login' element={<LoginForm handleLogin={handleLogin} handleSuccessLogin={handleSuccessLogin} />} />
        <Route path='/admin-profile' element={<AdminProfile />} />
        <Route path='/create-account/:newId' element={<AccountForm  />} />
        <Route path='/accounts/:id' element={<AccountForm  />} />
        <Route path='/catalog' element={<FullCatalog  />} />
        <Route path='/stock-monitor' element={<StockMonitor  />} />
        <Route path='/update-stock/:id' element={<UpdateStockForm  />} />
        <Route path='/customers' element={<CustomerList  />} />
        <Route path='/register' element={<CustomerForm  />} />
        <Route path='/customers/:id' element={<CustomerForm  />} />
        <Route path='/customer-profile/:id' element={<CustomerProfile />} />
        <Route path='/orders' element={<OrderList  />} />
        <Route path='/orders/:id' element={<OrderDetails  />} />
        <Route path='/orders/history-for-customer/:id' element={<OrderHistory  />} />
        <Route path='/orders/track-status/?customer_id=:customer_id&order_id=:order_id' element={<TrackOrder  />} />
        <Route path='/place-order' element={<OrderForm  />} />
        <Route path='/orders/:id' element={<OrderForm  />} />
        <Route path='/add-product' element={<ProductForm  />} />
        <Route path='/products/:id' element={<ProductForm  />} />
        <Route path='/products/active-products' element={<ProductList  />} />
        <Route path='*' element={<NotFound  />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
