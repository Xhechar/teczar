import React from "react";
import { Loader2 } from "lucide-react";

export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center shadow-glow animate-pulse">
        <Loader2 className="w-7 h-7 text-white animate-spin" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Loading…</p>
    </div>
  </div>
);