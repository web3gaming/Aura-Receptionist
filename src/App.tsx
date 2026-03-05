import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  Clock, 
  User, 
  Settings, 
  Calendar, 
  Bell, 
  Search,
  ChevronRight,
  Plus,
  ArrowUpRight,
  MessageSquare
} from "lucide-react";
import CallInterface from "./components/CallInterface";

export default function App() {
  const [isCalling, setIsCalling] = useState(false);

  const recentCalls = [
    { id: 1, name: "Sarah Jenkins", time: "10:45 AM", type: "Inquiry", status: "Completed" },
    { id: 2, name: "Unknown Caller", time: "09:30 AM", type: "Delivery", status: "Missed" },
    { id: 3, name: "Robert Chen", time: "Yesterday", type: "Meeting Request", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      {/* Navigation */}
      <nav className="h-20 border-b border-[#E5E5E0] px-8 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F27D26] rounded-xl flex items-center justify-center text-white font-serif text-xl font-bold italic">
            A
          </div>
          <h1 className="text-xl font-serif font-medium tracking-tight">Aura Receptionist</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="text-[#1A1A1A]">Dashboard</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Call Logs</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Schedule</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Directory</a>
          </div>
          <div className="flex items-center gap-4 border-l border-[#E5E5E0] pl-6">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Hero / Action Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-10 border border-[#E5E5E0] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D26]/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-[#F27D26]/10 transition-all duration-700" />
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif font-medium leading-tight">
                    Good morning, Aura is <br />
                    <span className="text-[#F27D26] italic">ready to assist.</span>
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    Your AI front desk is active and monitoring incoming inquiries. Start a manual call or review recent activity.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setIsCalling(true)}
                    className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-medium flex items-center gap-3 hover:bg-black transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-black/10"
                  >
                    <Phone className="w-5 h-5" />
                    Start Voice Call
                  </button>
                  <button className="px-8 py-4 bg-white border border-[#E5E5E0] text-[#1A1A1A] rounded-2xl font-medium flex items-center gap-3 hover:bg-gray-50 transition-all">
                    <Plus className="w-5 h-5" />
                    New Message
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Calls", value: "124", icon: Phone, trend: "+12%" },
                { label: "Avg. Duration", value: "2m 14s", icon: Clock, trend: "-5%" },
                { label: "Satisfaction", value: "98%", icon: User, trend: "+2%" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-[#E5E5E0] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      stat.trend.startsWith("+") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-serif font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-[32px] border border-[#E5E5E0] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-[#E5E5E0] flex items-center justify-between">
                <h3 className="font-serif font-medium text-lg">Recent Activity</h3>
                <button className="text-sm text-[#F27D26] font-medium hover:underline">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {recentCalls.map((call) => (
                  <div key={call.id} className="p-6 border-b border-[#E5E5E0] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-[#1A1A1A] group-hover:text-[#F27D26] transition-colors">{call.name}</p>
                      <p className="text-xs text-gray-400">{call.time}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{call.type}</p>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${
                        call.status === "Completed" ? "text-green-500" : "text-orange-500"
                      }`}>
                        {call.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-[#E5E5E0]">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E5E5E0] shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#F27D26]/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#F27D26]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1A1A1A]">System Status</p>
                    <p className="text-[10px] text-green-500 font-medium">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-medium">Staff Directory</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search staff..." 
                className="pl-10 pr-4 py-2 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 transition-all w-64"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Alex Rivera", role: "General Manager", status: "Available" },
              { name: "Elena Kostic", role: "Concierge", status: "Busy" },
              { name: "Marcus Thorne", role: "Security Chief", status: "Available" },
              { name: "Sofia Chen", role: "Events Director", status: "Away" },
            ].map((staff, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E5E5E0] hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${staff.name}/100/100`} alt={staff.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A] group-hover:text-[#F27D26] transition-colors">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1.5 ${
                    staff.status === "Available" ? "text-green-500" : staff.status === "Busy" ? "text-red-500" : "text-orange-500"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {staff.status}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#F27D26] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isCalling && (
          <CallInterface onEndCall={() => setIsCalling(false)} />
        )}
      </AnimatePresence>

      <footer className="p-8 border-t border-[#E5E5E0] text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
        &copy; 2024 Aura Intelligent Systems &bull; All Rights Reserved
      </footer>
    </div>
  );
}
