import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const FindHelper = () => {
  const locationData = useLocation();
  const navigate = useNavigate();
  const { service, location, work } = locationData.state || {};

  const [searching, setSearching] = useState(true);
  const [searchText, setSearchText] = useState("Broadcasting your request to nearby helpers...");
  const [activeJobId, setActiveJobId] = useState(null);
  const [helperMatch, setHelperMatch] = useState(null);
  const [currentFare, setCurrentFare] = useState(500); // base price
  
  const [activeChat, setActiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "helper", text: "Hi, I've accepted your job and I am on my way!" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const [isTimeout, setIsTimeout] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const pollingIntervalRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const textTimeoutRef = useRef(null);

  // 1. Create Job on Mount
  useEffect(() => {
    const createLiveRequest = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/jobs/create`, {
          serviceCategory: service || "General Help",
          location: location || "Your Location",
          userName: "Guest User",
          basePrice: currentFare
        }, { withCredentials: true });
        
        if (res.data.success) {
          setActiveJobId(res.data.job._id);
        }
      } catch (err) {
        console.error("Failed to create job", err);
      }
    };
    createLiveRequest();

    // Map text stages to build anticipation
    textTimeoutRef.current = setTimeout(() => {
      setSearchText("Waiting for a helper to accept...");
    }, 4000);

    // 1-minute timeout
    searchTimeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
    }, 60000);

    return () => {
      clearTimeout(textTimeoutRef.current);
      clearTimeout(searchTimeoutRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [service, location]);

  // 2. Poll for Acceptance & Completion
  useEffect(() => {
    if (!activeJobId) return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/jobs/status/${activeJobId}`);
        if (res.data.success) {
          if (res.data.job.status === "accepted" && !helperMatch) {
            setHelperMatch(res.data.job);
            setSearching(false);
            clearTimeout(searchTimeoutRef.current); // Stop timeout once accepted
          } else if (res.data.job.status === "completed" && !jobCompleted) {
            setHelperMatch(res.data.job);
            setJobCompleted(true);
            setSearching(false);
            clearInterval(pollingIntervalRef.current);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    pollingIntervalRef.current = setInterval(checkStatus, 2000);

    return () => clearInterval(pollingIntervalRef.current);
  }, [activeJobId, helperMatch, jobCompleted]);

  const handleIncreaseFare = async () => {
    if (!activeJobId) return;
    try {
      const res = await axios.put(`${backendUrl}/api/jobs/increase/${activeJobId}`, { amount: 50 });
      if (res.data.success) {
        setCurrentFare(res.data.job.price);
      }
    } catch (err) {
      console.error("Failed to increase fare", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: "user", text: newMessage }]);
    setNewMessage("");
    
    // Simulate helper reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "helper", text: "I will be there in just a few minutes." }]);
    }, 2500);
  };

  const cancelSearch = async () => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (activeJobId) {
      try {
        await axios.put(`${backendUrl}/api/jobs/cancel/${activeJobId}`);
      } catch (err) {
        console.error("Failed to cancel job", err);
      }
    }
    navigate("/");
  };

  const handleRateJob = async (e) => {
    e.preventDefault();
    if (!activeJobId) return;
    try {
      const res = await axios.post(`${backendUrl}/api/jobs/rate/${activeJobId}`, { rating, review });
      if (res.data.success) {
        setRatingSubmitted(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("Failed to rate job", err);
    }
  };

  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4 pb-20">
      <div className="max-w-2xl mx-auto">

        {/* SEARCHING STATE */}
        {searching && !isTimeout && (
          <div className="text-center bg-[#12292e] border border-teal-900/40 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Radar Animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full animate-ping pointer-events-none"></div>
            
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-6 rounded-full bg-teal-500 flex items-center justify-center text-black font-bold text-3xl shadow-[0_0_30px_rgba(20,184,166,0.6)]">
                📡
              </div>
            </div>

            <h2 className="text-2xl font-bold text-teal-400 mb-2 animate-pulse">
              {searchText}
            </h2>

            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Please do not close this window. We are actively ringing helpers within a 5km radius to assist you with '{service || 'your request'}'.
            </p>

            <div className="bg-[#0d1c1f] p-4 rounded-2xl border border-teal-900/50 inline-block text-left relative z-10 w-full max-w-sm mx-auto shadow-inner">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-bold text-gray-400">Current Fare Offer:</span>
                 <span className="text-2xl font-bold text-emerald-400">₹{currentFare}</span>
               </div>
               <p className="text-xs text-gray-500 mb-4">Want a faster response? Tip extra to incentivize nearby helpers immediately!</p>
               <button 
                 onClick={handleIncreaseFare}
                 className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-[#0d1c1f] transition font-bold py-2 rounded-xl flex items-center justify-center gap-2"
               >
                 <span>💸</span> Add +₹50 Tip
               </button>
            </div>

            <div className="mt-8">
              <button
                onClick={cancelSearch}
                className="px-8 py-3 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition font-bold"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* TIMEOUT STATE */}
        {searching && isTimeout && (
          <div className="text-center bg-[#12292e] border border-orange-900/40 p-10 rounded-3xl shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center text-4xl mx-auto mb-6 border border-orange-500/50">
              ⏳
            </div>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">No Helpers Available Nearby</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              It looks like all helpers are currently busy. You can either increase your offer to expand the search radius and incentivize helpers, or cancel the request.
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <button 
                 onClick={() => {
                   handleIncreaseFare();
                   setIsTimeout(false);
                   searchTimeoutRef.current = setTimeout(() => setIsTimeout(true), 60000);
                 }}
                 className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-[#0d1c1f] transition font-bold py-3 rounded-xl flex items-center justify-center gap-2"
               >
                 <span>💸</span> Increase Offer (+₹50) & Try Again
               </button>
               <button
                onClick={cancelSearch}
                className="w-full px-8 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition font-bold"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS MATCH STATE (Uber/Rapido style map) */}
        {!searching && helperMatch && !jobCompleted && (
          <div className="animate-fadeIn">
            <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-xl text-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl animate-bounce">
                🚀
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-400">Request Accepted!</h2>
                <p className="text-gray-300 text-sm">Your helper is on the way to {helperMatch.location}</p>
              </div>
            </div>

            <div className="bg-[#12292e] rounded-3xl border border-teal-900/40 overflow-hidden shadow-xl">
               {/* Map Area */}
               {!activeChat ? (
                 <div className="h-[300px] w-full bg-gray-800 relative z-0">
                    <iframe 
                      title="Live Location Map Tracker"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=73.8567437,18.5204303,73.8567437,18.5204303&layer=mapnik&marker=18.5204303,73.8567437`} 
                      className="opacity-75 grayscale contrast-125 pointer-events-none"
                    ></iframe>
                    <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(13,28,31,1)] pointer-events-none"></div>
                    
                    {/* Fake UI Overlay on Map */}
                    <div className="absolute top-4 right-4 bg-[#12292e]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-teal-500/30 text-xs font-bold text-teal-400 flex items-center gap-2">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                       LIVE TRACKING
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-sm text-white font-medium border border-white/10">
                       Arriving in ~8 mins
                    </div>
                 </div>
               ) : (
                 <div className="h-[300px] w-full bg-[#12292e] flex flex-col">
                    <div className="bg-[#0d1c1f] px-4 py-3 flex justify-between items-center border-b border-teal-900/50">
                       <div className="font-bold text-teal-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Chat with {helperMatch.helperName}
                       </div>
                       <button onClick={() => setActiveChat(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                       {chatMessages.map((msg, idx) => (
                         <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-teal-500 text-[#0d1c1f] rounded-br-none font-medium' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                               {msg.text}
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-3 bg-[#0d1c1f] border-t border-teal-900/50">
                       <form onSubmit={handleSendMessage} className="flex gap-2">
                         <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm outline-none focus:border-teal-500 border border-transparent transition" />
                         <button type="submit" className="bg-teal-500 text-black px-4 py-2 rounded-full text-sm font-bold">Send</button>
                       </form>
                    </div>
                 </div>
               )}

               {/* Driver Info */}
               <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-lg relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent"></div>
                           👨‍🔧
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white">{helperMatch.helperName}</h3>
                           <p className="text-teal-400 text-sm font-medium">{helperMatch.serviceCategory} Expert</p>
                           <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                             <span className="text-yellow-400">★ 4.9</span> (120+ ratings)
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm text-gray-400 mb-1">Fixed Fare</div>
                        <div className="text-2xl font-bold text-emerald-400">₹{helperMatch.price}</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <button className="flex items-center justify-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/30 py-3 rounded-xl hover:bg-teal-500 hover:text-[#0d1c1f] transition font-bold">
                        📞 Call Helper
                     </button>
                     <button onClick={() => setActiveChat(!activeChat)} className="flex items-center justify-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700 py-3 rounded-xl transition font-medium">
                        💬 {activeChat ? "Close Chat" : "Message"}
                     </button>
                  </div>

                  <div className="bg-[#0d1c1f] rounded-xl p-4 flex items-center justify-between border border-gray-800">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">💳</div>
                        <span className="text-sm font-medium text-gray-300">Cash on Completion</span>
                     </div>
                     <button onClick={cancelSearch} className="text-xs text-red-400 hover:underline hover:text-red-300 transition font-bold px-2 py-1">
                        Cancel booking
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* COMPLETED STATE */}
        {jobCompleted && (
          <div className="animate-fadeIn">
            <div className="bg-emerald-500/10 border border-emerald-500/40 p-8 rounded-3xl text-center mb-6 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-500/50">
                🎉
              </div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">Work Completed!</h2>
              <p className="text-gray-300 mb-8">Please pay the helper directly.</p>
              
              <div className="bg-[#12292e] rounded-2xl p-6 border border-teal-900/50 mb-8 max-w-sm mx-auto">
                <div className="text-gray-400 text-sm mb-1">Total Amount Due</div>
                <div className="text-5xl font-bold text-emerald-400 mb-4">₹{helperMatch.price}</div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <span>💳</span> Pay via Cash or UPI to {helperMatch.helperName}
                </div>
              </div>

              {!ratingSubmitted ? (
                <div className="bg-[#12292e] rounded-2xl p-6 border border-teal-900/50 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-teal-400 mb-4">Rate your experience</h3>
                  <form onSubmit={handleRateJob} className="flex flex-col gap-4">
                    <div className="flex justify-center gap-2 text-3xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setRating(star)}
                          className={star <= rating ? "text-yellow-400" : "text-gray-600"}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Leave a compliment or feedback (optional)" 
                      className="bg-[#0d1c1f] text-white p-3 rounded-xl border border-teal-900/50 outline-none focus:border-teal-500 min-h-[80px] text-sm"
                    />
                    <button type="submit" className="bg-teal-500 text-[#0d1c1f] font-bold py-3 rounded-xl hover:bg-teal-400 transition shadow-lg">
                      Submit Rating
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-teal-500/20 border border-teal-500/50 p-4 rounded-xl text-teal-400 font-bold">
                  Thank you for your feedback! Redirecting...
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FindHelper;
