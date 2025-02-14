import React from 'react'
import "./Navbar.css"
import { NavLink } from 'react-router-dom'

const Navbar = ({ username }) => {
  return (
    <nav className='navbar'>
        <div className='logo'>
            <NavLink to='/' className='logo-text'>
                Planify
            </NavLink>
        </div>
        <div className='nav-links'>
            <NavLink to={`/home/${username}`} className='nav-link' activeClassName='active-link'>
                Dashboard
            </NavLink>
            <NavLink to={`/profile/${username}`} className='nav-link' activeClassName='active-link'>
                Profile
            </NavLink>
            <NavLink to='/' className='nav-link' activeClassName='active-link'>
                Logout
            </NavLink>
        </div>
    </nav>
  )
}

export default Navbar



