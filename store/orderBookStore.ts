import {create} from 'zustand';
export type Trade = { price: number; qty: number; timestamp: number; isBuyerMaker: boolean };
type Side = 'bids' | 'asks';

interface State {
  bids: Map<string, number>;
  asks: Map<string, number>;
  trades: Trade[];
  setSnapshot: (bids: [string, number][], asks: [string, number][]) => void;
  applyDelta: (side: Side, price: string, qty: number) => void;
  pushTrade: (t: Trade) => void;
}

const useOrderBookStore = create<State>((set) => ({
  bids: new Map(),
  asks: new Map(),
  trades: [],
  setSnapshot: (bids, asks) => set(() => ({
    bids: new Map(bids),
    asks: new Map(asks),
  })),
  applyDelta: (side, price, qty) => set((state) => {
    const map = side === 'bids' ? new Map(state.bids) : new Map(state.asks);
    if (qty === 0) map.delete(price);
    else map.set(price, qty);
    return side === 'bids' ? { bids: map } : { asks: map };
  }),
  pushTrade: (t) => set((state) => ({ trades: [t, ...state.trades].slice(0, 50) })),
}));

export default useOrderBookStore;
