import { Route, Routes } from 'react-router-dom';
// Admin Components
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

function App() {

  useEffect(() => {
    sessionStorage.setItem('name', '');
    sessionStorage.setItem('customerId', '')
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('password', '');
    sessionStorage.setItem('isLoggedIn', false);
  });

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<HomePage  />} />
        <Route path='/login' element={<LoginForm  />} />
        <Route path='/create-account' element={<AccountForm  />} />
        <Route path='/accounts/:id' element={<AccountForm  />} />
        <Route path='/catalog' element={<FullCatalog  />} />
        <Route path='/catalog/stock-monitor' element={<StockMonitor  />} />
        <Route path='/catalog/update-stock/:id' element={<UpdateStockForm  />} />
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
