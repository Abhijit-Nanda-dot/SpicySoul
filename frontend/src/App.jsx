import React from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Cart from './pages/Cart/Cart.jsx';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx';
import { useState } from 'react';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';

const App = () => {

const [showLogin,setShowLogin] = useState(false);

  return (
    <>

    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

  <div className="App">
    <Navbar setShowLogin={setShowLogin}/>
    <div className="content">
    <Routes>
  
  <Route path='/' element={<Home/>}/>
  <Route path='/cart' element={<Cart/>}/>
  <Route path='/order' element={<PlaceOrder/>}/>
  
    </Routes>
    </div>
  
  <Footer />
  </div>
    </>
  );
};

export default App;
