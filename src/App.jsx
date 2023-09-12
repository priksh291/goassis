import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import Search from './Components/Search/Search'
import Hotelpage from './Components/HotelPage/Hotelpage';
// import Explore from './Components/Search/Explore/Explore'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
 

  return (
    <Router>
      <div>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Search/>}/>
          
          <Route path='/Hotelpage/:id' element={<Hotelpage/>}/>
          {/* <Route path='./Hotelpage/:id' element={<Hotelpage/>}/> */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
