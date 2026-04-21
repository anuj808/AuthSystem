import React from "react";
import Navbar from "../component/Navbar";
import Header from "../component/Header";
import OurServices from "../component/OurServices";
import UserHelperSections from "../component/UserHelperSections";
import RegisterSection from "../component/RegisterSection";
import Footer from "../component/Footer";


const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0b1c1c] to-[#081414]">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="m-10">
<Header />
<OurServices/>
<UserHelperSections/>
<RegisterSection/>
<Footer/>
      </div>
      
    </div>
  );
};

export default Home;
