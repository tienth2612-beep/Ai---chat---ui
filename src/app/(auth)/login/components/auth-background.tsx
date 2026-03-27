import React from "react";

export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#007bff] via-[#bfe1ff] to-[#4298f5] p-6 overflow-x-hidden overflow-y-auto">
      <div className="fixed top-[10%] left-[10%] w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[15%] right-[10%] w-48 h-48 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[450px] py-10">
        {children}
      </div>
    </div>
  );
}