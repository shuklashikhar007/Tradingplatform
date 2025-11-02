// components/RecentTrades.tsx
'use client';
import React from 'react';
import useOrderBookStore from '../store/orderBookStore';
import { formatNumber } from '../utils/format';

export default function RecentTrades() {
  const trades = useOrderBookStore((s) => s.trades);

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-medium mb-2">Recent Trades</h3>
      <div className="space-y-1 text-sm">
        {trades.map((t, i) => (
          <div key={t.timestamp + '-' + i} className="flex justify-between items-center">
            <div className={`w-28 ${t.isBuyerMaker ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(t.price)}</div>
            <div className="w-20 text-right">{formatNumber(t.qty)}</div>
            <div className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
