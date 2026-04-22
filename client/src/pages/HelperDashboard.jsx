import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const HelperDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(1250);
  const [jobsCompleted, setJobsCompleted] = useState(142);
  const [requests, setRequests] = useState([]);
  const [ringingJobId, setRingingJobId] = useState(null);
  const [declinedJobs, setDeclinedJobs] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: "user", text: "Please come quickly, it's urgent!" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Poll for live jobs when online
  useEffect(() => {
    let pollingInterval;
    if (isOnline) {
      pollingInterval = setInterval(async () => {
        try {
          const res = await axios.get(`${backendUrl}/api/jobs/available`);
          if (res.data.success) {
            // Find jobs we haven't seen or that are pending
            const newRequests = res.data.jobs.map(job => ({
              id: job._id,
              name: job.userName,
              service: job.serviceCategory,
              location: job.location,
              distance: job.distance || "3.2 km",
              status: job.status,
              price: job.price
            }));
            
            // Just for the cool "Uber Ringing" effect, alert when a new job appears
            if (newRequests.length > requests.length) {
                const latestJob = newRequests[0];
                if (latestJob && latestJob.id !== ringingJobId) {
                   setRingingJobId(latestJob.id);
                   const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                   audio.play().catch(e => console.log("Audio play prevented by browser"));
                }
            }

            setRequests(newRequests);
          }
        } catch (err) {
          console.error("Error fetching jobs", err);
        }
      }, 3000);
    } else {
      setRequests([]);
    }
    
    return () => clearInterval(pollingInterval);
  }, [isOnline, requests.length, ringingJobId]);

  const handleAccept = async (id, price) => {
    try {
      const res = await axios.post(`${backendUrl}/api/jobs/accept`, {
        jobId: id,
        helperName: "Premium Checked Helper", // Could be grabbed from context logic
      });

      if (res.data.success) {
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: "accepted" } : req
        ));
        setEarnings(prev => prev + parseInt(price));
        setJobsCompleted(prev => prev + 1);
        toast.success("Job Accepted! Navigating...");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept job");
    
    }
  };

  const handleDecline = (id) => {
    setDeclinedJobs(prev => [...prev, id]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: "helper", text: newMessage }]);
    setNewMessage("");
    
    // Simulate user reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "user", text: "Okay, got it!" }]);
    }, 2500);
  };

  const handleCompleteWork = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/jobs/complete/${id}`);
      if (res.data.success) {
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: "completed" } : req
        ));
        toast.success("Work marked as completed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete job");
    }
  };

  // Filter out declined jobs immediately, and also completed jobs if you want, but we can show them or just remove them
  const displayRequests = requests.filter(req => !declinedJobs.includes(req.id) && req.status !== "completed");


  return (
    <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4 pb-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40 sticky top-32 shadow-[0_0_20px_rgba(20,184,166,0.05)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-teal-500 text-[#0d1c1f] flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)] border-2 border-teal-300">
                H
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide">Helper Profile</h2>
                <p className="text-teal-400 text-sm font-medium">Professional Service Provider</p>
              </div>
            </div>
            
            <div className="space-y-5 text-gray-300">
              <div className="flex justify-between items-center border-b border-teal-900/40 pb-3">
                <span className="text-sm">Overall Rating</span>
                <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">⭐ 4.8</span>
              </div>
              <div className="flex justify-between items-center border-b border-teal-900/40 pb-3">
                <span className="text-sm">Jobs Completed</span>
                <span className="text-white font-bold">{jobsCompleted}</span>
              </div>
              <div className="flex justify-between items-center border-b border-teal-900/40 pb-3">
                <span className="text-sm">Today's Earnings</span>
                <span className="text-emerald-400 font-bold tracking-wide">₹{earnings}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm">Current Status</span>
                {isOnline ? (
                   <span className="text-teal-400 font-bold flex items-center gap-2 bg-teal-900/30 border border-teal-500/50 px-3 py-1.5 rounded-full text-xs cursor-pointer hover:bg-teal-900/50 transition" onClick={() => setIsOnline(false)}>
                     <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping absolute"></span>
                     <span className="w-2 h-2 rounded-full bg-teal-400 relative z-10"></span>
                     Looking for jobs
                   </span>
                ) : (
                   <span className="text-gray-400 font-bold flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 py-1.5 rounded-full text-xs cursor-pointer hover:bg-gray-700 transition" onClick={() => setIsOnline(true)}>
                     <span className="w-2 h-2 rounded-full bg-gray-500 relative z-10"></span>
                     Offline (Click to Connect)
                   </span>
                )}
              </div>
            </div>

            {!isOnline && (
                <button 
                  onClick={() => setIsOnline(true)}
                  className="w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-400 text-[#0d1c1f] font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition transform hover:-translate-y-0.5"
                >
                  Start Earning
                </button>
            )}
          </div>
        </div>

        {/* Requests Section */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6 bg-[#12292e] p-4 rounded-xl border border-teal-900/40">
            <h2 className="text-2xl font-bold text-teal-400 flex items-center gap-3">
               Radar Scanner
               {isOnline && <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>}
            </h2>
            <div className="bg-[#0d1c1f] border border-teal-900/40 px-4 py-2 rounded-full text-sm text-gray-300 font-bold">
              {displayRequests.filter(r => r.status === 'pending').length} Active Calls
            </div>
          </div>
          
          <div className="space-y-5 relative">
            {displayRequests.map(req => (
              <div 
                key={req.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 transform ${
                  req.status === 'pending' 
                    ? 'bg-[#12292e] border-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.15)] animate-pulse' 
                    : 'bg-emerald-900/20 border-emerald-500/50'
                }`}
                style={req.status === 'pending' ? { animationDuration: '2s' } : {}}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-2xl shadow-inner border border-gray-700">
                      👤
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                         {req.name}
                         {req.status === 'pending' && <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded text-white animate-bounce">NEW</span>}
                      </h3>
                      <p className="text-gray-400 text-sm mt-0.5">{req.service} requested at <span className="text-gray-200">{req.location}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-teal-400 text-xs bg-teal-900/30 px-3 py-1 rounded-full border border-teal-500/50 font-bold">
                      📍 {req.distance} away
                    </span>
                    <span className="text-emerald-400 font-bold text-2xl tracking-tighter">₹{req.price}</span>
                  </div>
                </div>
                
                {req.status === 'pending' ? (
                  <div className="mt-2 pt-4 border-t border-teal-900/50">
                    <div className="flex justify-between text-xs text-gray-400 mb-3 px-1 font-medium">
                       <span>Accept quick, request ringing in area...</span>
                       <span className="text-teal-400">Time remaining: 14s</span>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAccept(req.id, req.price)}
                        className="flex-[2] bg-gradient-to-r from-teal-500 to-teal-400 text-[#0d1c1f] font-bold py-3 rounded-xl hover:from-teal-400 hover:to-teal-300 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        ✅ Accept Ride / Job
                      </button>
                      <button 
                         onClick={() => handleDecline(req.id)}
                         className="flex-1 bg-gray-800 border border-gray-700 text-gray-400 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all font-bold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeIn mt-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-xl text-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl animate-bounce">
                        🚩
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-emerald-400">Target Assigned</h2>
                        <p className="text-gray-300 text-sm">Proceed to user's location at {req.location}</p>
                      </div>
                    </div>

                    <div className="bg-[#0d1c1f] rounded-3xl border border-teal-900/40 overflow-hidden shadow-xl">
                       {/* Map Area */}
                       {!activeChatId ? (
                         <div className="h-[250px] w-full bg-gray-800 relative z-0">
                            <iframe 
                              title="Location Map"
                              width="100%" 
                              height="100%" 
                              frameBorder="0" 
                              scrolling="no" 
                              marginHeight="0" 
                              marginWidth="0" 
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=77.2090,28.6139,77.2090,28.6139&layer=mapnik&marker=28.6139,77.2090`} 
                              className="opacity-60 contrast-150 grayscale pointer-events-none"
                            ></iframe>
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(13,28,31,1)] pointer-events-none"></div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur px-6 py-2 rounded-full text-sm text-teal-400 font-bold border border-teal-500/30">
                               Route Calculated • 2.5km
                            </div>
                         </div>
                       ) : (
                         <div className="h-[250px] w-full bg-[#12292e] flex flex-col">
                            <div className="bg-[#0d1c1f] px-4 py-3 flex justify-between items-center border-b border-teal-900/50">
                               <div className="font-bold text-teal-400 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Chat with {req.name}
                               </div>
                               <button onClick={() => setActiveChatId(null)} className="text-gray-400 hover:text-white">✕</button>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                               {chatMessages.map((msg, idx) => (
                                 <div key={idx} className={`flex ${msg.sender === 'helper' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'helper' ? 'bg-teal-500 text-[#0d1c1f] rounded-br-none font-medium' : 'bg-gray-700 text-white rounded-bl-none'}`}>
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

                       {/* Controls Area */}
                       <div className="p-5">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                             <button className="flex items-center justify-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/30 py-2.5 rounded-xl hover:bg-teal-500 hover:text-[#0d1c1f] transition font-bold text-sm">
                                📞 Call User
                             </button>
                             <button onClick={() => setActiveChatId(activeChatId ? null : req.id)} className="flex items-center justify-center gap-2 bg-gray-800 text-gray-300 hover:bg-gray-700 py-2.5 rounded-xl transition font-medium text-sm">
                                💬 {activeChatId ? "Close Chat" : "Message"}
                             </button>
                          </div>
                          <button 
                            onClick={() => handleCompleteWork(req.id)}
                            className="w-full bg-emerald-500 text-[#0d1c1f] font-bold py-3 rounded-xl hover:bg-emerald-400 transition transform hover:-translate-y-0.5 shadow-lg"
                          >
                            ✅ Mark Work as Completed & Collect Payment
                          </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {displayRequests.length === 0 && (
              <div className="text-center bg-[#12292e] border border-teal-900/40 rounded-3xl p-12 mt-4 shadow-inner relative overflow-hidden">
                 {isOnline && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse"></div>}
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="text-6xl mb-6">{isOnline ? "🎧" : "💤"}</div>
                    <h3 className="text-2xl font-bold mb-2">
                      {isOnline ? (
                         <span className="text-teal-400">Scanning your perimeter...</span>
                      ) : (
                         <span className="text-gray-400">Radar Offline</span>
                      )}
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                      {isOnline 
                        ? "Stay on this screen. When a user requests a job nearby, it will instantly pop up here with a ringing alert!" 
                        : "Toggle your status to 'Online' to start receiving live job requests from users in your area."}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelperDashboard;
