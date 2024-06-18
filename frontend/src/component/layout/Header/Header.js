import React from 'react'
import {ReactNavbar} from "overlay-navbar"
import logo from "../../../images/logo (1).svg"
const Header = () => {
  return (
    <ReactNavbar
      burgerColor="#eb4034"
      burgerColorHover="#a62d24"
      logo={logo}
      logoWidth="20vmax"
      navColor1="white"
      logoHoverSize="10px"
      logoHoverColor="#eb4034"
      link1Text="Home"
      link2Text="Products"
      link3Text="Contact"
      link4Text="About"
      link1Url="/"
      link2Url="/products"
      link3Url="/contact"
      link4Url="/about"
      link1Size="1.2vmax"
      link1Color="rgba(35, 35, 35,0.8)"
      nav1justifyContent="flex-end"
      nav2justifyContent="flex-end"
      nav3justifyContent="flex-start"
      nav4justifyContent="flex-start"
      link1ColorHover="#eb4034"
      link1Margin= "1vmax" 
      profileIconUrl= "/login"
      profileIconColor= "rgba(35, 35, 35,0.8)"
      searchIconColor= "rgba(35, 35, 35,0.8)"
      cartIconColor= "rgba(35, 35, 35,0.8)"
      profileIconColorHover= "#eb4034"
      searchIconColorHover= "#eb4034"
      cartIconColorHover= "#eb4034"
      cartIconMargin= "1vmax"

      
    />
  )
}

export default Header

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
