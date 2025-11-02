'use client';
import React from 'react';
import useOrderBookStore from '../store/orderBookStore';
import { formatNumber } from '../utils/format';
export default function RecentTrades() {
  const trades = useOrderBookStore((s) => s.trades);
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 font-sans">
      <h3 className="font-semibold text-lg mb-3">Recent Trades</h3>
      <div className="space-y-1 text-sm max-h-80 overflow-y-auto">
        {trades.map((t, i) => (
          <div
            key={t.timestamp + '-' + i}
            className={`flex justify-between items-center px-3 py-1 rounded transition hover:bg-gray-50`}
          >
            {/* Price */}
            <div
              className={`w-28 font-medium ${
                t.isBuyerMaker ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {formatNumber(t.price)}
            </div>
            {/* Quantity */}
            <div className="w-20 text-right font-semibold">{formatNumber(t.qty)}</div>
            {/* Timestamp */}
            <div className="text-xs text-gray-400">{new Date(t.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

