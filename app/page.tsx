// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useBinanceSocket } from '../hooks/useBinanceSocket';

const OrderBook = dynamic(() => import('../components/OrderBook'), { ssr: false });
const RecentTrades = dynamic(() => import('../components/RecentTrades'), { ssr: false });

export default function Page() {
  useBinanceSocket('btcusdt'); // start the socket for BTC/USDT

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Book Visualizer — BTC/USDT (live)</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <OrderBook />
        </div>
        <div className="col-span-1">
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}

