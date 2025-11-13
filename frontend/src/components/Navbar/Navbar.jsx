import React, { useState, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/store';

const Navbar = ({setShowLogin}) => {

  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  const { cartItems } = useContext(StoreContext);
  const totalCount = cartItems.reduce((s, it) => s + (it.quantity || 0), 0);
  const {token,setToken} = useContext(StoreContext);
  
  
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        
         <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search"/>
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="Cart"/>
          
          {totalCount > 0 && <div className="dot">{totalCount}</div>}
        </Link>

        {!token?<button onClick={()=>setShowLogin(true)}>sign in</button>
        :<div className='navbar-profile'>

          <img src={assets.profile_icon} alt="Profile" />

          <ul className="nav-profile-dropdown">
            <li onClick={() => navigate('/order')}>
              <img src={assets.bag_icon} alt='Orders' />
              <p>Orders</p>
            </li>
            <hr />
            <li onClick={() => {
              setToken("");
              localStorage.removeItem("token");
              navigate('/');
            }}>
              <img src={assets.logout_icon} alt='Logout' />
              <p>Logout</p>
            </li>
          </ul>

        </div>}
        
      </div>
    </div>
  );
};

export default Navbar;
