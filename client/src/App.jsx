import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import City from './pages/city'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:slug" element={<City />} />
      </Routes>
    </BrowserRouter>
  )
};