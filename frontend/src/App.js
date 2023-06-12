import './App.css';
import { useEffect, useState } from 'react';
import Header from "./component/layout/Header/Headers.js"
// import Header2 from './component/layout/Header/Header2';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";
import React from 'react';
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store";
import { loadUser } from './actions/userActions';
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import axios from 'axios';
import ProtectedRoute from './component/Route/ProtectedRoute';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from './component/Admin/ProcessOrder';
import UsersList from './component/Admin/UsersLists';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
// import Header3 from './component/layout/Header/Header3';
// import Banner from './component/Home/Banner';


// Error
// Reset Password is Not workimg because of tokan is valied 

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {

    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey()

  }, []);
  return (
    <Router>
      <Header />
      {/* <Banner /> */}
      {/* <Header3 /> */}
      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path='/process/payment' component={Payment} />
        </Elements>
      )}
      <Switch>

        <Route exact path="/" component={Home} />

        <Route exact path="/product/:id" component={ProductDetails} />

        <Route exact path="/products" component={Products} />

        <Route exact path="/search" component={Search} />

        <ProtectedRoute exact path="/account" component={Profile} />

        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

        <ProtectedRoute exact path="/password/update" component={UpdatePassword} />

        <Route exact path="/password/forgot" component={ForgotPassword} />

        <Route exact path="/password/reset/:token" component={ResetPassword} />

        <Route exact path="/login" component={LoginSignUp} />

        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/shipping" component={Shipping} />

        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />

        <ProtectedRoute exact path="/success" component={OrderSuccess} />

        <ProtectedRoute exact path="/orders" component={MyOrders} />

        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        <ProtectedRoute exact path="/admin/dashboard" component={Dashboard} />

        <ProtectedRoute exact path="/admin/products" component={ProductList} />

        <ProtectedRoute exact path="/admin/product" component={NewProduct} />

        <ProtectedRoute exact path="/admin/product/:id" component={UpdateProduct} />

        <ProtectedRoute exact path="/admin/orders" component={OrderList} />

        <ProtectedRoute exact path="/admin/order/:id" component={ProcessOrder} />

        <ProtectedRoute exact path="/admin/users" component={UsersList} />

        <ProtectedRoute exact path="/admin/user/:id" component={UpdateUser} />

        <ProtectedRoute exact path="/admin/reviews" component={ProductReviews} />

      </Switch>
      <Footer />
    </Router>

  );
}
export default App;
