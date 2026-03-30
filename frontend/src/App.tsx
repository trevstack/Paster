import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreatePaste from './pages/CreatePaste'
import ViewPaste from './pages/ViewPaste'
import EditPaste from './pages/EditPaste'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<CreatePaste />} />
        <Route path="/paste/:id" element={<ViewPaste />} />
        <Route path="/paste/:id/edit" element={<EditPaste />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
