import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'

const Header = () => {
  const navigate = useNavigate()
  const { userData } = useContext(AppContent)

  return (
    <header className="w-full min-h-screen flex flex-col justify-center items-center text-center bg-[#0d1c1f] text-white px-5 sm:px-8 pt-24">
      {/* ✅ Hero Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-snug sm:leading-tight max-w-3xl">
        Hey {userData ? userData.name : 'User'}, Welcome to{' '}
        <span className="text-teal-400">Helper Site</span>
      </h1>

      {/* ✅ Sub Text */}
      <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl px-2 sm:px-0">
        Get your trusted helpers quickly and easily.
        Whether it’s cleaning, repairs, or deliveries — we connect you with reliable people near you.
      </p>

      {/* ✅ Call to Action */}
      <button
        onClick={() => navigate('/services')}
        className="border border-teal-400 text-teal-300 rounded-full px-8 sm:px-10 py-3 mt-8 sm:mt-10 text-base sm:text-lg md:text-xl font-medium hover:bg-teal-500 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
      >
        Get Started
      </button>
    </header>
  )
}

export default Header
