import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import Home from './pages/home';
import City from './pages/city';
import Login from './pages/login';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:slug" element={<City />} />
          <Route path="/login/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};