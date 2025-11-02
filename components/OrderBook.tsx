'use client';
import React, { useMemo } from 'react';
import useOrderBookStore from '../store/orderBookStore';
import { formatNumber } from '../utils/format';

function mapToSortedArray(map: Map<string, number>, side: 'bids' | 'asks') {
  const arr = Array.from(map.entries()).map(([price, qty]) => ({ price: parseFloat(price), qty }));
  arr.sort((a, b) => side === 'bids' ? b.price - a.price : a.price - b.price);
  let cum = 0;
  return arr.map((r) => { cum += r.qty; return { ...r, total: cum }; });
}

export default function OrderBook() {
  const bidsMap = useOrderBookStore((s) => s.bids);
  const asksMap = useOrderBookStore((s) => s.asks);

  const bids = useMemo(() => mapToSortedArray(bidsMap, 'bids'), [bidsMap]);
  const asks = useMemo(() => mapToSortedArray(asksMap, 'asks'), [asksMap]);

  const topBid = bids[0]?.price ?? 0;
  const topAsk = asks[0]?.price ?? 0;
  const spread = topAsk - topBid;

  const maxBidTotal = bids.reduce((m, r) => Math.max(m, r.total), 0) || 1;
  const maxAskTotal = asks.reduce((m, r) => Math.max(m, r.total), 0) || 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 font-sans">
      {}
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-green-600">Bids</div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Spread</div>
          <div className="font-bold text-lg">{formatNumber(spread)}</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Top Bid / Ask</div>
          <div className="text-sm font-medium">{formatNumber(topBid)} / {formatNumber(topAsk)}</div>
        </div>
        <div className="font-semibold text-lg text-red-600">Asks</div>
      </div>

      {/* Order Book Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bids */}
        <div className="space-y-1">
          {bids.slice(0, 20).map((r) => (
            <div
              key={r.price}
              className="relative flex justify-between items-center text-sm px-2 py-1 rounded hover:bg-green-50 transition"
            >
              <div className="w-28 font-medium text-green-700">{formatNumber(r.price)}</div>
              <div className="w-24 text-right">{formatNumber(r.qty)}</div>
              <div className="w-24 text-right font-semibold">{formatNumber(r.total)}</div>
              <div
                className="absolute left-0 top-0 bottom-0 rounded-l"
                style={{
                  width: `${(r.total / maxBidTotal) * 100}%`,
                  background: 'rgba(16,185,129,0.2)',
                  zIndex: -1,
                }}
              />
            </div>
          ))}
        </div>

        {/* Asks */}
        <div className="space-y-1">
          {asks.slice(0, 20).map((r) => (
            <div
              key={r.price}
              className="relative flex justify-between items-center text-sm px-2 py-1 rounded hover:bg-red-50 transition"
            >
              <div className="w-28 font-medium text-red-700">{formatNumber(r.price)}</div>
              <div className="w-24 text-right">{formatNumber(r.qty)}</div>
              <div className="w-24 text-right font-semibold">{formatNumber(r.total)}</div>
              <div
                className="absolute right-0 top-0 bottom-0 rounded-r"
                style={{
                  width: `${(r.total / maxAskTotal) * 100}%`,
                  background: 'rgba(239,68,68,0.2)',
                  zIndex: -1,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

