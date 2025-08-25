import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider.jsx';
import Home from './pages/home';
import City from './pages/city';
import Login from './pages/login';
import Register from './pages/register';
import './global.css'
import './app.css'
import logo from './assets/images/logo.png';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="container" >
      
      <nav className="nav-links">
      <img src={logo} alt="Happy Hour Spot" />
        {user ? (
          <>
            <span>{user.name || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:slug" element={<City />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};