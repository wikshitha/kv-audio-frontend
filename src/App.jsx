import { BrowserRouter, Route, Routes } from "react-router-dom"
import Adminpage from "./pages/admin/addminpage.jsx"
import HomePage from "./pages/home/homePage.jsx"
import Testing from "./components/testing.jsx"
import LoginPage from "./pages/login/login.jsx"
import { Toaster } from "react-hot-toast"


function App() {


  return ( 
    <BrowserRouter>
    <Toaster/>
    <Routes path ="/*">
      <Route path="/testing" element={<Testing/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/admin/*" element={<Adminpage/>}/>
      <Route path="/*" element={<HomePage/>}/>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
