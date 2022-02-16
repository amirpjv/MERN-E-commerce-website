import { Routes, Route } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import CartScreen from './screens/CartScreen'
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProductListScreen from './screens/ProductListScreen'
import OrderListScreen from './screens/OrderListScreen'
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import SearchScreen from "./screens/SearchScreen";
import Sidebar from './components/Sidebar';
import MapScreen from "./screens/MapScreen";
import SupportScreen from './screens/SupportScreen';
import DashboardScreen from './screens/DashboardScreen';

const App = () => {

  return (
    <>
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <title>Amazona</title>
      <Header />
      <main >
        <Routes>
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/cart/:id" element={<CartScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} exact />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} exact />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/shipping" element={<ShippingAddressScreen />} />
          <Route path="/payment" element={<PaymentMethodScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/orderhistory" element={<OrderHistoryScreen />} />
          <Route path="/search/name" element={<SearchScreen />} exact></Route>
          <Route
            path="/search/name/:name"
            element={<SearchScreen />}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            element={<SearchScreen />}
            exact
          ></Route>
          <Route
            path="/search/pageNumber/:pageNumber"
            element={<SearchScreen />}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            element={<SearchScreen />}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            element={<SearchScreen />}
            exact
          ></Route>
          <Route
            path="/map"
            element={
              <PrivateRoute>
                <MapScreen />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>} />
          <Route path="/admin/support" element={<AdminRoute><SupportScreen /></AdminRoute>} />
          <Route path="/admin/productlist" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
          <Route path="/admin/productlist/pageNumber/:pageNumber" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
          <Route path="/admin/orderlist" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
          <Route path="/admin/userlist" element={<AdminRoute><UserListScreen /></AdminRoute>} />
          <Route path="/admin/user/:id/edit" element={<AdminRoute><UserEditScreen /></AdminRoute>} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;