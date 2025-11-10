import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ViewCustomer from './pages/ViewCustomer'

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
            <Home />
        } 
      />
      <Route 
        path="/customer/:id" 
        element={
            <ViewCustomer />
        } 
      />
    </Routes>
  )
}

export default App
