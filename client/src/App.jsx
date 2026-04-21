import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import About from "./pages/About";
import RegisterHelper from "./pages/RegisterHelper";
import Contact from "./pages/Contact"
import Services from "./pages/Services"
import FindHelper from "./pages/FindHelper";
import HelperDashboard from "./pages/HelperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
function App() {

  return (
    <>
     <div >
      <ToastContainer/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/email-verify" element={<EmailVerify/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
       

       
        <Route path="/about" element={<About />} />
        
<Route path="/register-helper" element={<RegisterHelper />} />

<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/Services" element={<Services />} />
<Route path="/find-helpers" element={<FindHelper />} />
<Route path="/helper-dashboard" element={<HelperDashboard />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
     </Routes>
     </div>
    </>
  )
}

export default App
