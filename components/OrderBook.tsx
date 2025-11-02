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
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Bids</div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Spread</div>
          <div className="font-semibold">{formatNumber(spread)}</div>
          <div className="text-xs text-gray-500">Top Bid / Ask</div>
          <div className="text-sm">{formatNumber(topBid)} / {formatNumber(topAsk)}</div>
        </div>
        <div className="font-medium">Asks</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          {bids.slice(0, 20).map((r) => (
            <div key={r.price} className="relative py-1 flex justify-between items-center text-sm">
              <div className="w-28">{formatNumber(r.price)}</div>
              <div className="w-24 text-right">{formatNumber(r.qty)}</div>
              <div className="w-24 text-right">{formatNumber(r.total)}</div>
              <div className="absolute left-0 top-0 bottom-0" style={{ width: `${(r.total / maxBidTotal) * 100}%`, background: 'rgba(16,185,129,0.12)', zIndex: -1 }} />
            </div>
          ))}
        </div>
        <div>
          {asks.slice(0, 20).map((r) => (
            <div key={r.price} className="relative py-1 flex justify-between items-center text-sm">
              <div className="w-28">{formatNumber(r.price)}</div>
              <div className="w-24 text-right">{formatNumber(r.qty)}</div>
              <div className="w-24 text-right">{formatNumber(r.total)}</div>
              <div className="absolute right-0 top-0 bottom-0" style={{ width: `${(r.total / maxAskTotal) * 100}%`, background: 'rgba(239,68,68,0.12)', zIndex: -1 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
