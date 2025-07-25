import { BrowserRouter, Route, Routes } from "react-router-dom"
import Adminpage from "./pages/admin/adminpage.jsx"
import HomePage from "./pages/home/homePage.jsx"
import Testing from "./components/testing.jsx"
import LoginPage from "./pages/login/login.jsx"
import { Toaster } from "react-hot-toast"
import RegisterPage from "./pages/register/register.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"
import VerifyEmail from "./pages/verifyEmail/verifyEmail.jsx"


function App() {


  return ( 
    <GoogleOAuthProvider clientId="621840375727-b79tnih5602fk0vdn9jkhvjeqdel94o9.apps.googleusercontent.com">
    <BrowserRouter>
    <Toaster/>
    <Routes path ="/*">
      <Route path="/testing" element={<Testing/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/verify-email" element={<VerifyEmail/>}/>
      <Route path="/admin/*" element={<Adminpage/>}/>
      <Route path="/*" element={<HomePage/>}/>
      
    </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
