'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useBinanceSocket } from '../hooks/usedBinanceSocket';
import { Bitcoin } from 'lucide-react';

const OrderBook = dynamic(() => import('../components/OrderBook'), { ssr: false });
const RecentTrades = dynamic(() => import('../components/RecentTrades'), { ssr: false });

export default function Page() {
  useBinanceSocket('btcusdt');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gray-900 text-gray-100 font-sans flex flex-col"
    >
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-transparent">
        {/* Page Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Bitcoin className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              BTC/USDT Order Book Visualizer — Live
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live Feed Active</span>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Order Book */}
          <div className="lg:col-span-2 bg-gray-800/90 rounded-2xl shadow-lg p-4 border border-gray-700">
            <OrderBook />
          </div>

          {/* Recent Trades */}
          <div className="lg:col-span-1 bg-gray-800/90 rounded-2xl shadow-lg p-4 border border-gray-700">
            <RecentTrades />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}





