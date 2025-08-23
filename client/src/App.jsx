import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import City from './pages/city'
// import Login from './pages/login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:slug" element={<City />} />
        {/* <Route path="/login/:slug?" element={<Login />} />
        <Route path="*" element={<div>Page not found</div>} /> */}
      </Routes>
    </BrowserRouter>
  )
};