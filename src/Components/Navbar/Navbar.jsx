import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div >
        <ul className='navbar-list'>
            <li><img src='https://raw.githubusercontent.com/gocomet-india/frontend-hotel-assignment/286ebfc6c07d6a38969da05b673b21be6e89eab3/book-my-hotel-logo.svg' alt='/'/></li>
            <li>Home</li>
            <li>Hotels</li>
            <li>Places</li>
        </ul>
      </div>
      <div className='Signin'>
        Sign In
      </div>
    </div>
  )
}

export default Navbar

