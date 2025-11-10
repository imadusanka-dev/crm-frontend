import { Routes, Route } from 'react-router-dom'
import DashboardContainer from './components/DashboardContainer'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
            <Home />
        } 
      />
    </Routes>
  )
}

export default App
