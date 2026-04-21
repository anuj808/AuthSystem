import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [activeTab, setActiveTab] = useState("helpers");
  const [pendingHelpers, setPendingHelpers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingHelpers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/helpers/pending");
      if (res.data.success) {
        setPendingHelpers(res.data.helpers);
      }
    } catch (err) {
      toast.error("Failed to fetch pending helpers");
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/contacts");
      if (res.data.success) {
        setContacts(res.data.contacts);
      }
    } catch (err) {
      toast.error("Failed to fetch contacts");
    }
  };

  const updateHelperStatus = async (email, status) => {
    try {
      const res = await axios.post("http://localhost:4000/api/admin/helpers/status", {
        email,
        status,
      });
      if (res.data.success) {
        toast.success(`Helper has been ${status}`);
        fetchPendingHelpers();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    
    setLoading(true);
    if (activeTab === "helpers") {
      fetchPendingHelpers().then(() => setLoading(false));
    } else if (activeTab === "contacts") {
      fetchContacts().then(() => setLoading(false));
    }
  }, [activeTab, isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return (
      <div className="pt-32 min-h-screen bg-[#0d1c1f] text-white px-4 flex flex-col items-center pb-24">
        <div className="max-w-sm w-full bg-[#12292e] p-8 rounded-2xl border border-teal-500/30 text-center shadow-[0_0_20px_rgba(20,184,166,0.1)]">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center text-2xl mb-4 border border-teal-500/50">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
          <input 
             type="password" 
             placeholder="Enter Admin Password"
             value={passwordInput}
             onChange={(e) => setPasswordInput(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter') {
                 if (passwordInput === 'Admin@1234') {
                   setIsAdminAuthenticated(true);
                 } else {
                   toast.error('Incorrect Password');
                 }
               }
             }}
             className="w-full bg-[#0d1c1f] text-white border border-teal-700/50 focus:border-teal-500 rounded-xl px-4 py-3 mb-4 outline-none transition"
          />
          <button 
             onClick={() => {
                if (passwordInput === 'Admin@1234') setIsAdminAuthenticated(true);
                else toast.error('Incorrect Password!');
             }} 
             className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-[#0d1c1f] font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition transform hover:-translate-y-0.5"
          >
             Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1c1f] text-white pt-28 px-4 pb-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-[#12292e] rounded-2xl p-6 border border-teal-900/40 sticky top-32">
            <h2 className="text-xl font-bold mb-6 text-teal-400">Admin Panel</h2>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                  activeTab === "overview"
                    ? "bg-teal-500 text-[#0d1c1f] shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                    : "text-gray-300 hover:bg-[#0d1c1f] hover:text-teal-400"
                }`}
              >
                System Overview
              </button>
              <button
                onClick={() => setActiveTab("helpers")}
                className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                  activeTab === "helpers"
                    ? "bg-teal-500 text-[#0d1c1f] shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                    : "text-gray-300 hover:bg-[#0d1c1f] hover:text-teal-400"
                }`}
              >
                Pending Verification
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                  activeTab === "contacts"
                    ? "bg-teal-500 text-[#0d1c1f] shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                    : "text-gray-300 hover:bg-[#0d1c1f] hover:text-teal-400"
                }`}
              >
                User Doubts / Contact
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-teal-900/40 text-center">
              <div className="text-sm text-gray-400 mb-1">Status</div>
              <div className="text-emerald-400 font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Online
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "overview" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-teal-400">Platform Analytics</h2>
                <p className="text-gray-400 mt-1">Key metrics and statistics of Servicio.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
                    <div className="text-4xl mb-3">👥</div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Total Users</div>
                    <div className="text-3xl font-bold text-white mt-1">14,204</div>
                 </div>
                 <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
                    <div className="text-4xl mb-3">🛠️</div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Active Helpers</div>
                    <div className="text-3xl font-bold text-teal-400 mt-1">2,845</div>
                 </div>
                 <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40">
                    <div className="text-4xl mb-3">💸</div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Total Payouts</div>
                    <div className="text-3xl font-bold text-emerald-400 mt-1">₹4.2M</div>
                 </div>
                 <div className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40 sm:col-span-3">
                    <div className="text-xl font-bold mb-4">System Health</div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-4 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold tracking-wider">
                      <span>98% Server Uptime</span>
                      <span>All servers operational</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "helpers" && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-teal-400">Helper Verification Requests</h2>
                  <p className="text-gray-400 mt-1">Review and approve new service providers.</p>
                </div>
                <div className="bg-[#12292e] px-4 py-2 border border-teal-900/40 rounded-lg text-sm">
                  {pendingHelpers.length} Pending
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 bg-[#12292e] border border-teal-900/40 rounded-2xl">
                  <span className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                </div>
              ) : pendingHelpers.length === 0 ? (
                <div className="text-center py-20 bg-[#12292e] border border-teal-900/40 rounded-2xl">
                  <div className="text-5xl mb-4">🙌</div>
                  <h3 className="text-xl font-bold text-gray-300">All caught up!</h3>
                  <p className="text-gray-500 mt-2">No pending helpers to verify.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingHelpers.map((helper) => (
                    <div key={helper._id} className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40 flex flex-col md:flex-row justify-between gap-6 transition hover:border-teal-500/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">Name</span>
                          <p className="font-semibold text-lg">{helper.name}</p>
                        </div>
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">Email</span>
                          <p className="text-gray-300">{helper.email}</p>
                        </div>
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">Service</span>
                          <p className="text-gray-300">{helper.serviceCategory}</p>
                        </div>
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">Phone</span>
                          <p className="text-gray-300">{helper.phone}</p>
                        </div>
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">ID Document</span>
                          <p className="text-gray-300">{helper.idProofType}</p>
                        </div>
                        <div>
                          <span className="text-xs text-teal-500 uppercase font-bold tracking-wider">Experience</span>
                          <p className="text-gray-300">{helper.experience} years</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 min-w-[140px] justify-center">
                        <button
                          onClick={() => updateHelperStatus(helper.email, "verified")}
                          className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black py-2.5 rounded-xl font-bold transition"
                        >
                          Verify & Approve
                        </button>
                        <button
                          onClick={() => updateHelperStatus(helper.email, "rejected")}
                          className="w-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white py-2.5 rounded-xl font-bold transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "contacts" && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-teal-400">User Doubts & Feedback</h2>
                  <p className="text-gray-400 mt-1">Review messages received from the Contact page.</p>
                </div>
                <div className="bg-[#12292e] px-4 py-2 border border-teal-900/40 rounded-lg text-sm">
                  {contacts.length} Messages
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 bg-[#12292e] border border-teal-900/40 rounded-2xl">
                  <span className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-20 bg-[#12292e] border border-teal-900/40 rounded-2xl">
                  <div className="text-5xl mb-4">📥</div>
                  <h3 className="text-xl font-bold text-gray-300">Inbox Zero</h3>
                  <p className="text-gray-500 mt-2">No messages from users at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact._id} className="bg-[#12292e] p-6 rounded-2xl border border-teal-900/40 relative">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-teal-900/40">
                        <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold text-xl border border-teal-500/30">
                          {contact.name[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{contact.name}</h3>
                          <div className="text-sm text-gray-400">{contact.email} • {new Date(contact.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                      
                      <div className="mt-6 flex justify-end">
                        <button className="text-sm text-teal-400 hover:text-teal-300 border border-teal-400/50 hover:border-teal-400 px-4 py-2 rounded-lg transition">
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
