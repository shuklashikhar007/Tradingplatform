'use client';

import dynamic from 'next/dynamic';
import { useBinanceSocket } from '../hooks/usedBinanceSocket';

const OrderBook = dynamic(() => import('../components/OrderBook'), { ssr: false });
const RecentTrades = dynamic(() => import('../components/RecentTrades'), { ssr: false });

export default function Page() {
  useBinanceSocket('btcusdt');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        BTC/USDT Order Book Visualizer — Live
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Book */}
        <div className="lg:col-span-2">
          <OrderBook />
        </div>

        {/* Recent Trades */}
        <div className="lg:col-span-1">
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}


