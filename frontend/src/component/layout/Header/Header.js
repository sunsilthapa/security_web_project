// import React from 'react'
// import {ReactNavbar} from "overlay-navbar"
// import logo from "../../../images/logo (1).svg"
// const Header = () => {
//   return (
//     <ReactNavbar
//       burgerColor="#eb4034"
//       burgerColorHover="#a62d24"
//       logo={logo}
//       logoWidth="20vmax"
//       navColor1="white"
//       logoHoverSize="10px"
//       logoHoverColor="#eb4034"
//       link1Text="Home"
//       link2Text="Products"
//       link3Text="Contact"
//       link4Text="About"
//       link1Url="/"
//       link2Url="/products"
//       link3Url="/contact"
//       link4Url="/about"
//       link1Size="1.2vmax"
//       link1Color="rgba(35, 35, 35,0.8)"
//       nav1justifyContent="flex-end"
//       nav2justifyContent="flex-end"
//       nav3justifyContent="flex-start"
//       nav4justifyContent="flex-start"
//       link1ColorHover="#eb4034"
//       link1Margin= "1vmax" 
//       profileIconUrl= "/login"
//       profileIconColor= "rgba(35, 35, 35,0.8)"
//       searchIconColor= "rgba(35, 35, 35,0.8)"
//       cartIconColor= "rgba(35, 35, 35,0.8)"
//       profileIconColorHover= "#eb4034"
//       searchIconColorHover= "#eb4034"
//       cartIconColorHover= "#eb4034"
//       cartIconMargin= "1vmax"

      
//     />
//   )
// }

// export default Header

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../../images/logo.png'

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="header__logo-img"  />
        </Link>
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <Link to="/" className="header__nav-link">Home</Link>
          </li>
          <li className="header__nav-item">
            <Link to="/products" className="header__nav-link">Products</Link>
          </li>
          <li className="header__nav-item">
            <Link to="/contact" className="header__nav-link">Contact</Link>
          </li>
          <li className="header__nav-item">
            <Link to="/about" className="header__nav-link">About</Link>
          </li>
        </ul>
      </nav>
      <div className="header__icons">
        <Link to="/cart" className="header__icon">
          <i className="fas fa-shopping-cart"></i>
        </Link>
        <Link to="/login" className="header__icon">
          <i className="fas fa-user"></i>
        </Link>
        <Link to="/search" className="header__icon">
          <i className="fas fa-search"></i>
        </Link>
      </div>
    </header>
  );
};

export default Header;

// import React from 'react';
// import logo from '../../../images/logo (1).svg';
// import './Header.css';

// const Header = () => {
//   return (
//     <header className="navbar">
//       <div className="navbar__logo">
//         <img src={logo} alt="Logo" />
//       </div>
//       <nav className="navbar__links">
//         <a href="/" className="navbar__link">Home</a>
//         <a href="/products" className="navbar__link">Products</a>
//         <a href="/contact" className="navbar__link">Contact</a>
//         <a href="/about" className="navbar__link">About</a>
//       </nav>
//       <div className="navbar__icons">
//         <a href="/login" className="navbar__icon">
//         User
//           <i className="fas fa-user"></i>
//         </a>
//         <a href="/search" className="navbar__icon">
//           <i className="fas fa-search"></i>
//         </a>
//         <a href="/cart" className="navbar__icon">
//           <i className="fas fa-shopping-cart"></i>
//         </a>
//       </div>
//       <div className="navbar__burger">
//         <i className="fas fa-bars"></i>
//       </div>
//     </header>
//   );
// };

// export default Header;
