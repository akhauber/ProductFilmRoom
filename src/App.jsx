import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import HomePage from './pages/HomePage'
import ArchivePage from './pages/ArchivePage'
import EpisodePage from './pages/EpisodePage'
import AboutPage from './pages/AboutPage'

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AppRoutes />
    </BrowserRouter>
  )
}
