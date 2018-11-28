import React, { Component } from 'react';
import './Header.css';
import logo from '../../logos/logo_sm.png';

function Header(props){
  return (
    <header className='header'>
      <img src={logo} width='32px'/>
    </header>
  )
}

export default Header;