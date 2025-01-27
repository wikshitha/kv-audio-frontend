import { BrowserRouter, Route, Routes } from "react-router-dom"
import Adminpage from "./pages/admin/addminpage.jsx"
import HomePage from "./pages/home/homePage.jsx"


function App() {


  return ( 
    <BrowserRouter>
    <Routes path ="/*">
      <Route path="/admin/*" element={<Adminpage/>}/>
      <Route path="/*" element={<HomePage/>}/>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
