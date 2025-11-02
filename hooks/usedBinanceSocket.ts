// hooks/useBinanceSocket.ts
import { useEffect, useRef } from 'react';
import useOrderBookStore from '../store/orderBookStore';
import type { Trade } from '../store/orderBookStore';

const REST_BASE = 'https://api.binance.com';

export function useBinanceSocket(symbol = 'btcusdt') {
  const wsRef = useRef<WebSocket | null>(null);
  const depthQueue = useRef<any[]>([]);
  const snapshotRef = useRef<{ lastUpdateId: number } | null>(null);

  const setSnapshot = useOrderBookStore((s) => s.setSnapshot);
  const applyDelta = useOrderBookStore((s) => s.applyDelta);
  const pushTrade = useOrderBookStore((s) => s.pushTrade);

  useEffect(() => {
    const depthStream = `${symbol}@depth@100ms`;
    const aggStream = `${symbol}@aggTrade`;
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${depthStream}/${aggStream}`;

    let ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // When messages arrive, the payload is { stream, data }
    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        const { stream, data } = payload;
        if (stream && stream.endsWith('@depth@100ms')) {
          depthQueue.current.push(data);
          if (snapshotRef.current) applyDepthQueue();
        } else if (stream && stream.endsWith('@aggTrade')) {
          // agg trade: p=price, q=quantity, T=timestamp, m=isBuyerMaker
          const t: Trade = {
            price: parseFloat(data.p),
            qty: parseFloat(data.q),
            timestamp: data.T,
            isBuyerMaker: data.m,
          };
          pushTrade(t);
        }
      } catch (err) {
        console.error('ws parse err', err);
      }
    };

    ws.onopen = () => {
      // fetch REST snapshot once connected
      fetchSnapshot();
    };

    ws.onclose = () => {
      // try to reconnect after short delay
      setTimeout(() => useBinanceSocket(symbol), 1000);
    };

    async function fetchSnapshot() {
      try {
        const res = await fetch(`${REST_BASE}/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`);
        const json = await res.json();
        snapshotRef.current = { lastUpdateId: json.lastUpdateId };
        setSnapshot(
          json.bids.map((b: any) => [b[0], parseFloat(b[1])]),
          json.asks.map((a: any) => [a[0], parseFloat(a[1])])
        );
        applyDepthQueue();
      } catch (err) {
        console.error('snapshot fetch error', err);
      }
    }

    function applyDepthQueue() {
      const snapId = snapshotRef.current?.lastUpdateId ?? 0;
      while (depthQueue.current.length) {
        const ev = depthQueue.current.shift();
        // ev.U = first updateId in event, ev.u = last updateId in event
        if (ev.u <= snapId) continue; // already in snapshot
        for (const [p, q] of ev.b) {
          applyDelta('bids', p, parseFloat(q));
        }
        for (const [p, q] of ev.a) {
          applyDelta('asks', p, parseFloat(q));
        }
        snapshotRef.current!.lastUpdateId = ev.u;
      }
    }

    return () => {
      try { ws.close(); } catch (e) {/* ignore */ }
      wsRef.current = null;
    };
  }, [symbol, setSnapshot, applyDelta, pushTrade]);
}
