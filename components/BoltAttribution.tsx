'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function BoltAttribution() {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-3 py-2 glass rounded-full border border-white/30 hover:bg-white/40 transition-all duration-300 group"
      >
        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
          Built with
        </span>
        <span className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          bolt.new
        </span>
        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-700 transition-colors" />
      </a>
    </motion.div>
  );
}