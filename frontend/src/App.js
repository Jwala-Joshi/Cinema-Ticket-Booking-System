import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer';
import NavBar from './layout/NavBar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Settings from './pages/Settings';
import AddMovie from './pages/AddMovie';
import UserData from './pages/UserData';
import UserBookings from './pages/UserBookings';
import { isLoggedIn, login, logout } from './utils/Auth';

function App() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    login(userData);
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar
          user={user}
          onSearch={handleSearch}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path='/'
            element={<Home searchText={searchText} user={user} />}
          />
          <Route path='/movie/:id' element={<MovieDetails />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/add-movie' element={<AddMovie />} />
          <Route path='/users' element={<UserData />} />
          <Route path='/user-bookings/:userId' element={<UserBookings />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;