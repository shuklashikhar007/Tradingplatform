'use client';
import React, { useMemo, useState } from 'react';
import useOrderBookStore from '../store/orderBookStore';
import { formatNumber } from '../utils/format';

function mapToSortedArray(map: Map<string, number>, side: 'bids' | 'asks') {
  const arr = Array.from(map.entries()).map(([price, qty]) => ({ price: parseFloat(price), qty }));
  arr.sort((a, b) => (side === 'bids' ? b.price - a.price : a.price - b.price));
  let cum = 0;
  return arr.map((r) => {
    cum += r.qty;
    return { ...r, total: cum };
  });
}

export default function OrderBook() {
  const bidsMap = useOrderBookStore((s) => s.bids);
  const asksMap = useOrderBookStore((s) => s.asks);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const bids = useMemo(() => mapToSortedArray(bidsMap, 'bids'), [bidsMap]);
  const asks = useMemo(() => mapToSortedArray(asksMap, 'asks'), [asksMap]);

  const topBid = bids[0]?.price ?? 0;
  const topAsk = asks[0]?.price ?? 0;
  const spread = topAsk - topBid;

  const maxTotal = Math.max(
    bids.reduce((m, r) => Math.max(m, r.total), 0),
    asks.reduce((m, r) => Math.max(m, r.total), 0),
    1
  );

  return (
    <div className="bg-[#0e1117] text-gray-200 rounded-xl shadow-lg p-5 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-green-400">Bids</div>
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Spread</div>
          <div className="font-bold text-lg text-yellow-400">
            {spread > 0 ? formatNumber(spread) : '--'}
          </div>
          <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Top Bid / Ask</div>
          <div className="text-sm font-medium text-gray-300">
            {formatNumber(topBid)} / {formatNumber(topAsk)}
          </div>
        </div>
        <div className="font-semibold text-lg text-red-400">Asks</div>
      </div>

      {/* Order Book Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bids */}
        <div className="space-y-1">
          {bids.slice(0, 20).map((r) => {
            const selected = selectedPrice === r.price;
            return (
              <div
                key={r.price}
                onClick={() => setSelectedPrice(r.price)}
                className={`relative flex justify-between items-center text-xs px-2 py-1 rounded cursor-pointer transition 
                  ${selected ? 'bg-green-800/40' : 'hover:bg-green-800/20'}
                `}
              >
                <div className="w-24 font-medium text-green-400">{formatNumber(r.price)}</div>
                <div className="w-20 text-right">{formatNumber(r.qty)}</div>
                <div className="w-20 text-right font-semibold">{formatNumber(r.total)}</div>

                {/* Depth background */}
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-l transition-all"
                  style={{
                    width: `${(r.total / maxTotal) * 100}%`,
                    background: 'rgba(16,185,129,0.25)',
                    zIndex: -1,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Asks */}
        <div className="space-y-1">
          {asks.slice(0, 20).map((r) => {
            const selected = selectedPrice === r.price;
            return (
              <div
                key={r.price}
                onClick={() => setSelectedPrice(r.price)}
                className={`relative flex justify-between items-center text-xs px-2 py-1 rounded cursor-pointer transition 
                  ${selected ? 'bg-red-800/40' : 'hover:bg-red-800/20'}
                `}
              >
                <div className="w-24 font-medium text-red-400">{formatNumber(r.price)}</div>
                <div className="w-20 text-right">{formatNumber(r.qty)}</div>
                <div className="w-20 text-right font-semibold">{formatNumber(r.total)}</div>

                {/* Depth background */}
                <div
                  className="absolute right-0 top-0 bottom-0 rounded-r transition-all"
                  style={{
                    width: `${(r.total / maxTotal) * 100}%`,
                    background: 'rgba(239,68,68,0.25)',
                    zIndex: -1,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Price Footer */}
      {selectedPrice && (
        <div className="mt-4 text-center text-sm text-yellow-400">
          Selected Price: <span className="font-bold">{formatNumber(selectedPrice)}</span>
        </div>
      )}
    </div>
  );
}


