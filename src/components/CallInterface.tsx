import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GeminiLiveService } from "../services/geminiLive";

interface CallInterfaceProps {
  onEndCall: () => void;
}

export default function CallInterface({ onEndCall }: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<"connecting" | "active" | "ended">("connecting");
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<{ role: "user" | "aura", text: string }[]>([]);
  const serviceRef = useRef<GeminiLiveService | null>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const service = new GeminiLiveService();
    serviceRef.current = service;

    service.connect({
      onOpen: () => setStatus("active"),
      onClose: () => setStatus("ended"),
      onMessage: (msg) => {
        if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
          setTranscript(prev => [...prev, { role: "aura", text: msg.serverContent!.modelTurn!.parts[0].text! }]);
        }
      },
      onError: (err) => {
        console.error(err);
        setStatus("ended");
      }
    });

    const timer = setInterval(() => {
      if (statusRef.current === "active") {
        setDuration(d => d + 1);
      }
    }, 1000);

    return () => {
      service.disconnect();
      clearInterval(timer);
    };
  }, []);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-2xl bg-[#FDFCFB] rounded-[32px] overflow-hidden shadow-2xl border border-[#E5E5E0] flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-8 border-bottom border-[#E5E5E0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#F27D26]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[#F27D26]" />
              </div>
              {status === "active" && (
                <div className="absolute -inset-1 rounded-full border-2 border-[#F27D26] animate-pulse-ring" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium">Aura Receptionist</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-orange-500"}`} />
                {status === "connecting" ? "Connecting..." : status === "active" ? "Live Call" : "Call Ended"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-light tracking-tight">
              {formatDuration(duration)}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Duration</p>
          </div>
        </div>

        {/* Transcript/Visualizer Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FDFCFB]">
          {transcript.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <p className="text-sm font-serif italic">Speak now, Aura is listening...</p>
            </div>
          ) : (
            transcript.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "aura" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "aura" 
                    ? "bg-white border border-[#E5E5E0] text-[#1A1A1A]" 
                    : "bg-[#F27D26] text-white"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="p-8 bg-white border-t border-[#E5E5E0] flex items-center justify-center gap-8">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button 
            onClick={onEndCall}
            className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          <button className="w-14 h-14 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-all">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
