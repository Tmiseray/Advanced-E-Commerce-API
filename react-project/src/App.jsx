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

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<HomePage  />} />
        <Route path='/login' element={<LoginForm  />} />
        <Route path='/accounts' element={<AccountForm  />} />
        <Route path='/accounts/specified-customer/?customer_id=:customerId' element={<AccountForm  />} />
        <Route path='/catalog' element={<FullCatalog  />} />
        <Route path='/catalog/stock-monitor' element={<StockMonitor  />} />
        <Route path='/catalog/update-stock/specified-product/?product_id=:productId' element={<UpdateStockForm  />} />
        <Route path='/customers' element={<CustomerList  />} />
        <Route path='/customers' element={<CustomerForm  />} />
        <Route path='/customers/:customerId' element={<CustomerForm  />} />
        <Route path='/customer-profile/:id' element={<CustomerProfile />} />
        <Route path='/orders' element={<OrderList  />} />
        <Route path='/orders/:orderId' element={<OrderDetails  />} />
        <Route path='/orders/history-for-customer/?customer_id=:customerId' element={<OrderHistory  />} />
        <Route path='/orders/track-status/?order_id=:orderId&customer_id=:customerId' element={<TrackOrder  />} />
        <Route path='/place-order' element={<OrderForm  />} />
        <Route path='/products' element={<ProductForm  />} />
        <Route path='/products/:productId' element={<ProductForm  />} />
        <Route path='/products/active-products' element={<ProductList  />} />
        <Route path='*' element={<NotFound  />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
